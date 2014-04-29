var Main,
    R                     = require('renderer'),
    PresentationDashboard = require('presentation-dashboard');

Main = {
  render: function (parentEl) {
    parentEl.appendChild(R(PresentationDashboard));
  }
};

module.exports = Main;
