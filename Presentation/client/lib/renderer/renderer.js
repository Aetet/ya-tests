var Renderer = function (Prototype, options) {
  var component, el;
  options      = options || {};
  component    = new Prototype(options);
  el           = document.createElement(component.root || 'div');
  el.innerHTML = component.render();

  if (component.componentDidMount) {
    component.componentDidMount(el);
  }

  return el;
};

module.exports = Renderer;
