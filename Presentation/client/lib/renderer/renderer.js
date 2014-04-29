/**
 * Небольшой фреймворк для реализации React-подобного подхода с DSL.
 *
 * Renderer         создает HTMLElement на основе имени тега или прототипа.
 * Renderer.refresh вызывает метод render у элемента и обновляет dom
 * Render.setState  меняет свойство state у компонента и вызывает refresh
 */
var Renderer, isString;

/**
 * Проверяет стока ли полученное значение
 *
 * @param value
 *
 * @return {Bool}
 */
isString = function (value) {
  return toString.call(value) === '[object String]';
};

/**
 * Создает HTMLElement на основе имени тега или прототипа
 *
 * @param {Object|String}    Prototype        имя тега или прототип с методом render, который возвращает массив HTMLElement
 *
 * @param {String}             Prototype.root            по-умолчанию div, имя тега создаваемого HTMLElement
 * @param {Function}           Prototype.render          метод, который должен возвращать массив HTMLElement-объектов
 * @param {String}             Prototype.className       имя класса создаваемого элемента
 * @param {Function|undefined} Prototype.getInitialState хэш свойств, начальное состояние объекта
 * @param {Function|undefined} Prototype.getDefaultProps хэш свойств, свойства объекта, если не заданы из вне
 *
 * @param {Object|undefined} options          свойства html тега в соотвествии со спецификацией, свойства onClick, onChange и т.д.
 *                                            транслируются в события
 * @param {Function}         options.onClick  Обработчик click
 * @param {Function}         options.onChange Обработчик change
 * @param {Array}            options.children интерпретируется как массив HTMLElement, которые добавятся в создаваемый элемент
 *
 * @return HTMLElement
 *
 * В случае, если аргумент Prototype - прототип, то
 *
 * 1. Создается объект и ему передаются все options
 * 2. В него добавляются свойства state:{} и props: {]}, если их там еще нет
 * 3. Если объект содержит метод getDefaultProps, который возвращает хэш свойств, то эти свойства копируются в props без перезаписи
 * 4. Если объект содержит метод getInitialState, который возвращает хэш свойств, то эти свойства копируются в state
 * 5. Создается HTMLElement с именем тега div, если таковой не задан в свойстве root объекта
 * 6. Устанавливается имя класса
 * 7. Вызывается метод render и полученный массив HTMLElement при помоще appendChild добавляется в созданый в п. 5 div
 *
 * @example
 *
 * Renderer('h1', {innerHTML: 'hello'});
 * // <h1>hello</h1>
 *
 * Renderer('ul', {children: [
 *   Renderer('li', {innerHTML: 'test 1'}),
 *   Renderer('li', {innerHTML: 'test 2'}),
 *   Renderer('li', {innerHTML: 'test 3'})
 * ]});
 * // <ul><li>test 1</li><li>test 2</li><li>test 3</li></ul>
 *
 * var TestElement = function () {
 *   this.className = 'test';
 * };
 * TestElement.prototype.render = function () {
 *   return [
 *     Renderer('span', {innerHTML: this.props.title, className: 'subheader'})
 *   ];
 * }
 * Renderer(TestElement, {title: 'test'})
 * // <div class="test"><span class="subheader">test</span></div>
 */
Renderer = function (Prototype, options) {
  var key,
      component,
      el,
      eventNames = ['onClick', 'onChange'];

  options = options || {};

  if (isString(Prototype)) {
    el = document.createElement(Prototype);

    // делегируем свойства из options в dom элемент
    // children, onClick, onChange обрабатываются иначе
    Object.keys(options).forEach(function (key) {
      if (eventNames.indexOf(key) !== -1 ) {
        //события вида onClick транслируем в click и т.д.
        el.addEventListener(key.substr(2).toLowerCase(), options[key]);
      } else if (key === 'children') {
        options.children.forEach(function (element) {
            el.appendChild(element);
        });
      } else {
        el[key] = options[key];
      }
    });

  } else {
    component = new Prototype(options);
    if (!component.state) {
      component.state = {};
    }
    if (!component.props) {
      component.props = {};
    }

    if (component.getDefaultProps) {
      //Недеструктивно копируем в props все свойства из defaultProps
      var defaultProps = component.getDefaultProps();
      for (key in defaultProps) {
        if (typeof component.props[key] === 'undefined') {
          component.props[key] = defaultProps[key];
        }
      }
    }

    if (component.getInitialState) {
      component.state = component.getInitialState();
    }

    el = document.createElement(component.root || 'div');

    if (options.className) {
      el.className = options.className;
    } else if (component.className) {
      el.className = component.className;
    }

    component.el = el;
    component.render().forEach(function (element) {
      el.appendChild(element);
    });
  }

  return el;
};

/**
 * Заново рендерит компонент и обновляет dom
 *
 * @param {Object} component
 */
Renderer.refresh = function (component) {
  var el = component.el;
  el.innerHTML = '';
  component.render().forEach(function (element) {
      el.appendChild(element);
  });
};

/**
 * Меняет свойство state в компоненте и обновляет dom.
 *
 * Свойства state перезатирают уже существующие, не трогая остальные.
 *
 * @param {Object} component
 * @param {Object} state
 */
Renderer.setState = function (component, state) {

  var oldState = component.state || {};

  for (var key in state) {
    if (typeof state[key] !== 'undefined') {
      oldState[key] = state[key];
    }
  }
  component.state = oldState;
  Renderer.refresh(component);
};

module.exports = Renderer;
