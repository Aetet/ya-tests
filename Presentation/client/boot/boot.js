var Presenter    = require('presenter'),
    Renderer     = require('renderer');

module.exports = {
  render: function (parentEl) {
    var el = Renderer(Presenter);

    parentEl.appendChild(el);
  }
};
