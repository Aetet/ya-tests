var Slide,
    R = require('renderer');

Slide = function (props) {
  this.props = props;
};

Slide.prototype.render = function () {
  return [
    R('h3', {innerHTML: 'Слайд № ' + this.props.key})
  ];
};

module.exports = Slide;
