/**
 * formDiff Выводит различия в данных формы по-сравнению с предыдущими данными.
 *
 * Для экономии времени я не стал использовать сборщики модулей, поэтому все функции перечислил в одном файле.
 * В среде node.js все функции доступны через require, что бы облегчить тестирование.
 * В браузере через переменную window.
 */
(function(module) {

  var util = {
    /**
     * Проверка на object (взято из lodash)
     *
     * @param obj
     *
     * @return {Bool}
     */
    isObject: function(obj) {
      return !!(obj && typeof obj === 'object');
    },

    /**
     * Форматирует строку подставляя значения из formatParameters вместо ключевых слов, начинающихся с :
     *
     * @param {String} text
     * @param {Object} formatParameters
     *
     * @return {String}
     *
     * @example
     *
     * format('user email is :email', {email: 'test@ya.ru'});
     * // user email is test.ya.ru
     */
    format: function(text, formatParameters) {
      return text.replace(/:(\w+)/g, function(match, key) {
        return formatParameters.hasOwnProperty(key) ? formatParameters[key] : '';
      });
    },

    /**
     * Находит элементы в src, не содержащиеся в dest.
     *
     * Алгоритм не оптимален на больших объемах данных, но для разбора опций формы достаточно.
     *
     * @param {Array} src
     * @param {Array} dest
     *
     * @return {Array}
     *
     * @example
     *
     * src = [1, 2, 3, 4];
     * dest = [3];
     * arrayDiff(src, dest);
     * // [1, 2, 4]
     */
    arrayDiff: function (src, dest) {
      return src.filter(function (item) {
        return dest.indexOf(item) === -1;
      });
    },

    /**
     * Сравнивает 2 массива по ключам, если хоть один отличается - возвращает false, инача - true.
     *
     * @param {Array} src
     * @param {Array} dest
     *
     * @return {Bool}
     *
     * @example
     *
     * isArrayEqual([1, 2, 3], [1, 2, 5]);
     * // false
     *
     * isArrayEqual([1, 2, 3], [1, 2, 3]);
     * // true
     */
    isArraysEqual: function (src, dest) {
      if (src.length !== dest.length) {
        return false;
      }
      for (var i = 0, length = src.length ; i < length; i++) {
        if (src[i] !== dest[i]) {
          return false;
        }
      }

      return true;
    },

    /**
     * Проверяет равны ли 2 значения, в случае массива проверяет каждый елемент.
     *
     * @param {Array} src
     * @param {Array} dest
     *
     * @return {Bool}
     */
    isEqualValues: function (src, dest) {
      if((Array.isArray(src) && Array.isArray(dest))) {
        return util.isArraysEqual(src, dest);
      } else {
        return src === dest;
      }
    }
  };

  /**
   * Преобразует html-объект формы в js-объект
   *
   * Можно было взять serializeArray из jquery, но на выходе эта функция дает массив объектов вида [{name: 'test', value: '1'}]
   * Для работы нашего diff удобнее работать с объектами вида: {name: 1, options: [1, 2, 3]}
   *
   * Ограничение: свойства в результате будут в алфавитном порядке, не в соотвествии с html-формой.
   * Но для текущей задачи это не имеет значения, в любом случае можно доработать функцию
   *   и отдавать отдельно массив названий свойств в нужном порядке.
   *
   * @param {HTMLFormElement} form
   *
   * @return {Object}
   */
  var serializeForm = function (form) {
    if (!form || form.nodeName !== 'FORM') {
      throw new TypeError('argument form is not a HTMLFormElement');
    }

    var element, name, value,
        result = {};

    // Проходимся по всем элементам формы и в зависимости от типа, добавляем в результат свойство со значением
    for (var i = 0, length = form.elements.length; i < length ; i++) {
      element = form.elements[i];
      name    = element.name;
      value   = element.value;

      switch (element.type) {
        // Не будем учитывать кнопки
        // Также, для упрощения, не будем смотреть разницу в поле типа file
        case 'file':
        case 'reset':
        case 'submit':
        case 'button':
          break;

        case 'select-multiple':
          // Не очень хорошо использовать var в этом блоке.
          // Он находится достаточно далеко от начала функции, можно незаметить и продублировать переменную.
          // Поэтому оборачиваем в функцию.
          (function () {
            var options = element.options;
            if (!Array.isArray(result[name])) {
              result[name] = [];
            }

            for (var j = 0, optionsLength = options.length; j < optionsLength ; j++) {
              var option = options[j];
              if (option.selected) {
                result[name].push(option.value);
              }
            }
          })();
          break;
        // Отличающиеся от input а поля обрабатываем отдельно, проверяем их свойство checked
        case 'checkbox':
        case 'radio':
          if(element.checked) {
            if (element.dataset.multiple) {
              if (!Array.isArray(result[name])) {
                result[name] = [];
              }

              result[name].push(value);
            } else {
              result[name] = value;
            }
          }
          break;
        // Правильнее перечислить здесь только валидные типы, а на остальные бросать исключение, для упрощения оставим default.
        default:
          result[name] = value;
          break;
      }
    }

    return result;
  };

  /**
   * Создает запись об изменениях между значениями from и to
   *
   * @param {String} name
   * @param {String|Number|Array|undefined} from
   * @param {String|Number|Array|undefined} to
   *
   * @return {String}                        result.name Имя свойства, которое было изменено.
   * @return {String|Number|Array|undefined} result.from Предыдущее значение.
   * @return {String|Number|Array|undefined} result.to   Текущее значение.
   * @return {String}                        result.operation Тип операции: add, delete, change.
   * @return {String}                        result.type тип значения: scalar, array.
   * @return {Array|undefined}               result.arrayAdded Для массивов, содержит новые элементы в массиве.
   * @return {Array|undefined}               result.arrayDeleted Для массивов, содержит удаленные из массива элементы.
   *
   * @example
   *
   * createDiffRecord('test', 'v1', 'v2');
   * // {name: 'test', from: 'v1', to: 'v2', operation: 'change', type: 'scalar'}
   *
   * createDiffRecord('arr', ['a', 'b'],['b', 'c']);
   * // {name: 'arr', from: ['a', 'b'], to: ['b', 'c'], arrayAdded: ['c'], arrayDeleted: ['a'], operation: 'change', type: 'array'}
   */
  var createDiffRecord = function (name, from, to) {
    var toNormalized,
        fromNormalized,
        result      = {name: name, from: from, to: to},
        isFromArray = Array.isArray(from),
        isToArray   = Array.isArray(to);

    if (typeof to === 'undefined') {
      result.operation = 'delete';
    } else if (typeof from === 'undefined') {
      result.operation = 'add';
    } else {
      result.operation = 'change';
    }

    if (isFromArray || isToArray) {
      fromNormalized      = isFromArray ? from.slice(0) : (from ? [from] : []);
      toNormalized        = isToArray ? to.slice(0) : (to ? [to] : []);

      result.arrayAdded   = util.arrayDiff(toNormalized, fromNormalized);
      result.arrayDeleted = util.arrayDiff(fromNormalized, toNormalized);
      result.type         = 'array';
    } else {
      result.type = 'scalar';
    }

    return result;
  };

  /**
   * Сравнение двух объектов без учета рекурсии.
   *
   * @param {Object} src
   * @param {Object} dest
   *
   * @result {Array}
   *
   * @throw TypeError Если src или dest не объекты.
   *
   * @example
   *
   * diffObjects({test: 'v1'}, {test: 'v2'});
   * // [{name: 'test', from: 'v1', to: 'v2', operation: 'change', type: 'scalar'}]
   *
   * diffObjects({}, {test: 'v2'});
   * // [{name: 'test', from: undefined, to: 'v2', operation: 'add', type: 'scalar'}]
   *
   * diffObjects({test: 'v1'}, {});
   * // [{name: 'test', from: 'v1', to: undefined, operation: 'delete', type: 'scalar'}]
   *
   * diffObjects({}, {arr: ['a', 'b']});
   * // [{name: 'arr', from: undefined, to: ['a', 'b'], arrayAdded: ['a', 'b'], arrayDeleted: [], operation: 'add', type: 'array'}]
   *
   * diffObjects({arr: ['a', 'b']}, {});
   * // [{name: 'arr', from: ['a', 'b'], to: undefined, arrayAdded: [], arrayDeleted: ['a', 'b'], operation: 'delete', type: 'array'}]
   *
   * diffObjects({arr: ['a', 'b']}, {arr: ['b', 'c']});
   * // [{name: 'arr', from: ['a', 'b'], to: ['b', 'c'], arrayAdded: ['c'], arrayDeleted: ['a'], operation: 'change', type: 'array'}]
   */
  var diffObjects = function (src, dest) {
    var filteredDest,
        prop,
        result = [];

    if (!util.isObject(src)) {
      throw new TypeError('First argument is not an object');
    }
    if (!util.isObject(dest)) {
      throw new TypeError('Second argument is not an object');
    }

    src  = src  || {};
    dest = dest || {};

    // Копируем свойства dest в новый объект, что бы потом определить какие свойства были уже проверены в первом цикле
    filteredDest = {};
    Object.keys(dest).forEach(function (key) {
      filteredDest[key] = true;
    });

    // Надо проверять объединение свойств src и dest объектов, поэтому сначала итерируем свойства src, затем dest.
    // undefined свойства тоже надо сравнивать, т.к. если мы снимаем галку, то это поле убирается из dom-объекта формы совсем.
    // Поэтому не проверяем src и dest на hasOwnProperty, сюда должны попадать только raw-объекты, которые отдает serializeForm.
    // hasOwnProperty обычно используют, что бы удостовериться, что это свойства объекта, а не прототипа.
    for(prop in src) {
      // из dest мы убираем те свойства, которые уже встретились в src и проверены, что бы не итерировать их в следующем for еще раз
      delete filteredDest[prop];
      if (!util.isEqualValues(src[prop], dest[prop])) {
        result.push(createDiffRecord(prop, src[prop], dest[prop]));
      }
    }

    for(prop in filteredDest) {
      if (!util.isEqualValues(src[prop], dest[prop])) {
        result.push(createDiffRecord(prop, src[prop], dest[prop]));
      }
    }

    return result;
  };

  /**
   * Форматирует результат сравнения 2х объектов в строку для последующего вывода в консоль.
   *
   * @param {String}                        item.name Имя свойства, которое было изменено.
   * @param {String|Number|Array|undefined} item.from Предыдущее значение.
   * @param {String|Number|Array|undefined} item.to   Текущее значение.
   * @param {String}                        item.operation Тип операции: add, delete, change.
   * @param {String}                        item.type тип значения: scalar, array.
   * @param {Array|undefined}               item.arrayAdded Для массивов, содержит новые элементы в массиве.
   * @param {Array|undefined}               item.arrayDeleted Для массивов, содержит удаленные из массива элементы.
   *
   * @return {String}
   *
   * @throws TypeError Если item не объект или его тип не scalar и не array.
   *
   * @example
   *
   * diffFormat({name: 'test', from: 'v1', to: 'v2', operation: 'change', type: 'scalar'})
   * // поле test изменено с v1 на v2
   *
   * diffFormat({name: 'test', from: 'v2', to: undefined, operation: 'delete', type: 'scalar'})
   * // поле test теперь пустое (было v2)
   *
   * diffFormat({name: 'test', from: undefined, to: 'v3', operation: 'add', type: 'scalar'})
   * // поле test теперь не пустое (стало v3)
   *
   * diffFormat({name: 'arr', operation: 'add', type: 'array', arrayAdded: ['a', 'b']})
   * // Изменено поле arr, добавлены элементы: a, b
   *
   * diffFormat({name: 'arr', operation: 'delete', type: 'array', arrayDeleted: ['a']})
   * // Изменено поле arr, удалены элементы: a
   *
   * diffFormat({name: 'arr', operation: 'delete', type: 'array', arrayDeleted: ['a', 'b'], arrayAdded['c', 'd']})
   * // Изменено поле arr, добавлены элементы: c, d, удалены элементы: a, b
   */
  var diffFormat = function (item) {
    var formatParameters, messagesMap, messages, messageBlock;

    messagesMap = {
      empty: {
        from: 'пустого',
        to:   'пустое'
      },
      scalar: {
        change: 'Поле :name изменено с :from на :to',
        add:    'Поле :name теперь не пустое (стало :to)',
        delete: 'Поле :name теперь пустое (было :from)'
      },
      array: {
        change: 'Изменено поле :name',
        add:    'добавлены элементы: :arrayAdded',
        delete: 'удалены элементы: :arrayDeleted'
      }
    };

    if (!util.isObject(item)) {
      throw new TypeError('Item is not an object');
    }
    if (!messagesMap.hasOwnProperty(item.type)) {
      throw new TypeError('Unknown type ' + item.type + ' in item ' + item.name);
    }
    if (!messagesMap[item.type].hasOwnProperty(item.operation)) {
      throw new TypeError('Unknown operation ' + item.operation + ' for type ' + item.type + '  in item ' + item.name);
    }

    if (item.type === 'scalar') {
      // Для простых типов формируем блок параметров name, from, to
      message = messagesMap[item.type][item.operation];
      formatParameters = {
        name: item.name,
        from: item.from || messagesMap.empty.from,
        to:   item.to || messagesMap.empty.to
      };
    } else {
      //для массивов формируем блок на основе добавленных и удаленных элементов
      messages     = [];
      messageBlock = messagesMap[item.type];

      if (item.arrayAdded.length) {
        messages.push(messageBlock.add);
      }
      if (item.arrayDeleted.length) {
        messages.push(messageBlock.delete);
      }

      message = messageBlock.change + ', ' + messages.join(', ');

      formatParameters = {
        name:         item.name,
        arrayAdded:   item.arrayAdded.join(', '),
        arrayDeleted: item.arrayDeleted.join(', ')
      };
    }

    return util.format(message, formatParameters);
  };

  /**
   * Слушает событие submit у формы, получает ее состояние, сравнивает состояние с предыдущим и пишет разницу в элемент log.
   *
   * @param {HTMLElement} form  Форма, изменения которой отслеживаем.
   * @param {HTMLElement} log   div Куда будет выводиться лог.
   */
  var bindTo = function (form, log) {
    // В prevFormData хранится предыдущее состояние формы, для упрощения храним просто в памяти браузера.
    var dataset = {
      prevFormData: serializeForm(form)
    };

    form.addEventListener('submit', function (e) {
      var currentFormData,
          diff,
          form = e.target;

      e.preventDefault();

      currentFormData      = serializeForm(form);
      diff                 = diffObjects(dataset.prevFormData, currentFormData);
      dataset.prevFormData = Object.create(currentFormData);

      if (diff.length) {
        console.log(diff);
        log.innerHTML = '<ul class="log-list"><li class="log-list-item">' + diff.map(diffFormat).join('</li><li class="log-list-item">') + '</li></ul>' + log.innerHTML;
      }

    });
  };

  module.exports = {
    bindTo:        bindTo,
    diffObjects:   diffObjects,
    serializeForm: serializeForm
  };
// В случае если require не найден - решаем, что мы в браузере и экспортируем функции в window, иначе - в module
})(typeof require === 'undefined' ? window : module);
