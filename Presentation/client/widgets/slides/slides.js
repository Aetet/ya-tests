var Slides,
    R     = require('renderer'),
    Slide = require('slide');

Slides = function (props) {
  this.props = props;
};

var Proto = Slides.prototype;

Proto.getDefaultProps = function () {
  return {
    slides: []
  };
};

Proto.render = function () {
  var slides = this.props.slides.map(function (slide, index) {
    return R(Slide, {slide: slide, number: index});
  });

  return [

  ].concat(slides);
};

module.exports = Slides;
