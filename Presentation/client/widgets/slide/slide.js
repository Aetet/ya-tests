var Slide,
    R            = require('renderer');

Slide = function () {};
var Proto = Slide.prototype;

Proto.getDefaultProps = function () {
  return {
    number: 1
  };
};

Proto.render = function () {
  return [
    R('h3', 'Слайд № ' + this.props.number)
  ];
};

module.exports = Slide;
