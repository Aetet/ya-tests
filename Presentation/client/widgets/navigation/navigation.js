/**
 * Навигация по слайдам: кнопки вперед, назад и номер текущего слайда
 *
 * props:
 *
 * @param {Function} onPrev callback срабатывает при нажатии кнопки назад
 * @param {Function} onNext callback срабатывает при нажатии кнопки вперед
 * @param {Number}   currentSlide номер текущего слайда (от 1)
 * @param {Number}   totalSlides сколько всего слайдов
 */
var Navigation,
    R = require('renderer');

Navigation = function (props) {
  this.props     = props;
};

Navigation.prototype.getDefaultProps = function () {
  return {
    children: [],
    onNext: function () {
      console.error('onNext callback required');
    },
    onPrev: function () {
      console.error('onPrev callback required');
    },
    currentSlide: 0,
    totalSlides: 0
  };
};

Navigation.prototype.render = function () {
  var props = this.props;

  return R('div', {
    className: 'navigation',
    children: [
      R('div', {
        className: 'navigation-wrapper-left',
        children : props.children
      }),
      R('div', {
        className: 'navigation-wrapper-right',
        children : props.totalSlides ? [
          R('button', {innerHTML: '<', onClick: props.onPrev, className: 'navigation-button-prev'}),
          R('span',   {innerHTML: props.currentSlide + ' из ' + props.totalSlides, className: 'navigation-indicator'}),
          R('button', {innerHTML: '>', onClick: props.onNext, className: 'navigation-button-next'})
        ] : [
          R('div', {innerHTML: 'нет ни одного слайда', className: 'navigation-button-noButtons'})
        ]
      })
    ]
  });
};

module.exports = Navigation;
