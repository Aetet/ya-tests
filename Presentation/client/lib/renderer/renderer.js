var isString = function (value) {
  return toString.call(value) === '[object String]';
};

var Renderer = function (Prototype, options) {
  var key, component, el;
  options = options || {};
  if (isString(Prototype)) {
    el = document.createElement(Prototype);

    ['innerHTML', 'type', 'name', 'value', 'className', 'src'].forEach(function (property) {
      if (typeof options[property] !== 'undefined') {
        el[property] = options[property];
      }
    });

    ['click', 'change'].forEach(function (property) {
      var eventName = 'on' + property.charAt(0).toUpperCase() + property.slice(1);
      if (options[eventName]) {
        el.addEventListener(property, options[eventName]);
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
