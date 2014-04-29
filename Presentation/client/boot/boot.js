/**
 * Boot.render Рендерит главный элемент страницы - доску с презентациями
 */
var Boot,
    R                     = require('renderer'),
    PresentationDashboard = require('presentation-dashboard');

Boot = {
  /**
   * Рендерит главный элемент страницы - доску с презентациями
   *
   * @param {HTMLElement} parentEl родительский элемент, куда будет отображаться приложение
   */
  render: function (parentEl) {
    parentEl.appendChild(R(PresentationDashboard));
  }
};

module.exports = Boot;
