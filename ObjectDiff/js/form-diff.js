/**
 * formDiff Выводит различия в данных формы, по сравнению с предыдущими данными.
 *
 * Для экономии времени я не стал использовать сборщики модулей, поэтому все функции перечислил в одном файле.
 * Тем более, что текущей задачи это вполне оправдано.
 * В среде node.js все функции доступны через require, что бы облегчить тестирование.
 * В браузере через переменную window.
 */
(function(module) {
  /** 
   * Сериализует форму в js-объект
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
      return;
    }

    var element, name, value,
        result = {};
 
    /**
     * Добавляет в объект свойство, если это свойство уже есть - превращает его в массив и добавляет значение в конец.
     *
     * @param {Object}             result это объект будет модифицироваться
     * @param {String}             name   название свойства
     * @param {String|Number|Bool} value  значение свойства
     *
     * @example
     *
     * var result = {};
     * addToProperty(result, 'test', 'aa');
     * // result: {test: 'aa'}
     *
     * addToProperty(result, 'test', 'bb');
     * // result: {test: ['aa', 'bb']}
     */
    var addToProperty = function (result, name, value) {
      if (result.hasOwnProperty(name)) {
        if (!Array.isArray(result[name])) {
          result[name] = [result[name]];
        }
        result[name].push(value);
      } else {
        result[name] = value;  
      }
    };
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
            for (var j = 0, optionsLength = options.length; j < optionsLength ; j++) {
              var option = options[j];
              if (option.selected) {
                addToProperty(result, name, option.value);
              }
            }
          })();
          break;
        // Отличающиеся от input а поля обрабатываем отдельно, проверяем их свойство checked
        case 'checkbox':
        case 'radio':
          if(element.checked) {
            addToProperty(result, name, value);
          }
          break;
        // Правильнее перечислить здесь только валидные типы, а на остальные бросать исключение, для упрощения оставим default.
        default:
          addToProperty(result, name, value);
          break;
      }
    }

    return result;
  };

  var diffObjects = function (src, dest) {
    var prop,
        result       = [],
        filteredDest = Object.create(dest);

    // Надо проверять объединение свойств src и dest объектов, поэтому сначала итерируем свойства src, затем dest
    // undefined свойства тоже надо сравнивать, т.к. если мы снимаем галку, то это поле убирается из dom-объекта формы совсем.
    // Поэтому не проверяем src и dest на hasOwnProperty, сюда должны попадать только raw-объекты, которые отдает serializeForm.
    // hasOwnProperty обычно используют, что бы удостовериться, что это свойства объекта, а не прототипа.
    for(prop in src) {
      // из dest мы убираем те свойства, которые уже встретились в src и проверены, что бы не итерировать их в следующем for еще раз
      if (filteredDest.hasOwnProperty(prop)) {
        delete filteredDest[prop];
      }
      if (src[prop] !== dest[prop]) {
        result.push({name: prop, from: src[prop], to: dest[prop]});
      }
    }

    for(prop in filteredDest) {
      if (src[prop] !== dest[prop]) {
        result.push({name: prop, from: src[prop], to: dest[prop]});
      }
    }

    return result;
  };

  var formDiff = function (form, log) {
    // Хотя formDiff вызывается статически, но для каждой формы будет свой dataset в стеке, поэтому конфликтов не должно возникнуть.
    // В prevFormData хранится предыдущие состояние формы, для упрощения храним просто в памяти браузера.
    var dataset = {
      prevFormData: serializeForm(form)
    };

    form.addEventListener('submit', function (e) {
      var currentFormData,
          form    = e.target,
          prevFormData = dataset.prevFormData;

      e.preventDefault();
      currentFormData = serializeForm(form);

      var diff = diffObjects(prevFormData, currentFormData);
      console.log(prevFormData, currentFormData);
      dataset.prevFormData = Object.create(currentFormData);

      diff.forEach(function (diffEl) {
        console.log(diffEl.name + ' changed from ' + diffEl.from + ' to ' + diffEl.to);
      });
    });
  };

  module.exports = {
    formDiff: formDiff,
    diffObjects: diffObjects,
    serializeForm: serializeForm
  };
// В случае если require не найден - решаем, что мы в браузере и экспортируем функции в window, иначе - в module
})(typeof require === 'undefined' ? window : module);
