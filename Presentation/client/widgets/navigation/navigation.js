var Navigation,
    R = require('renderer');

Navigation = function (props) {
  if (!props.onPrev) {
    throw new TypeError('onPrev callback required');
  }
  if (!props.onNext) {
    throw new TypeError('onNext callback required');
  }
  this.props = props;

  this.className = 'navigation';
};

Navigation.prototype.getDefaultProps = function () {
  return {
    currentSlide: 0,
    totalSlides: 0
  };
};

Navigation.prototype.render = function () {
  var props = this.props;

  return [
    R('button', {innerHTML: '<', onClick: props.onPrev, className: 'navigation-button-prev'}),
    R('span',   {innerHTML: props.currentSlide + ' из ' + props.totalSlides, className: 'navigation-indicator'}),
    R('button', {innerHTML: '>', onClick: props.onNext, className: 'navigation-button-next'})
  ];
};

module.exports = Navigation;
