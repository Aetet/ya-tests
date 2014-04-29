var isString = function (value) {
  return toString.call(value) === '[object String]';
};

var Renderer = function (Prototype, options) {
  var key, component, el;
  options = options || {};
  if (isString(Prototype)) {
    el = document.createElement(Prototype);
    if (options.className) {
      el.className = options.className;
    }
    el.innerHTML = options.innerHTML;
    if (options.onClick) {
      el.addEventListener('click', options.onClick);
    }
    if (options.onChange) {
      el.addEventListener('change', options.onChange);
    }
  } else {
    component = new Prototype(options);
    if (!component.state) {
      component.state = {};
    }
    if (!component.props) {
      component.props = {};
    }

    if (component.getDefaultProps) {
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
    if (component.componentDidMount) {
      component.componentDidMount();
    }
  }

  return el;
};
Renderer.refresh = function (component) {
  var el = component.el;
  el.innerHTML = '';
  component.render().forEach(function (element) {
      el.appendChild(element);
    });
};

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
