var testUtils,
    R = require('renderer');

testUtils = {
  getParentEl: function () {
    var parentEl = document.querySelector('#app');

    if (!parentEl) {
      parentEl = document.createElement('div');
      parentEl.setAttribute('id', 'app');
      parentEl.setAttribute('class', 'app-layout');
      document.querySelector('body').appendChild(parentEl);
    }
    return parentEl;
  },
  render: function (Widget, options, cb) {
    var parentEl = testUtils.getParentEl();
    parentEl.innerHTML = '';
    var el = R(Widget, options);
    //parentEl.appendChild(el);

    cb && cb(el);

    return el;
  }
};

module.exports = testUtils;
