var Presenteration,
    R          = require('renderer'),
    Slide      = require('slide'),
    Navigation = require('navigation');

Presentation = function (props) {
  this.props = props;
  this.className = 'presentation';
};

Presentation.prototype.getDefaultProps = function () {
  return {
    number: 1
  };
};

Presentation.prototype.getInitialState = function () {
  return {
    slides: [],
    currentSlide: 0
  };
};

Presentation.prototype.onNavigationPrev = function () {
  console.log('prev slide');
  var prevSlideIndex = this.state.currentSlide - 1;
  if (prevSlideIndex > 0) {
    R.setState(this, {currentSlide: prevSlideIndex});
  }
};

Presentation.prototype.onNavigationNext = function () {
  console.log('next slide');
  var nextSlideIndex = this.state.currentSlide + 1;
  if (nextSlideIndex <= this.state.slides.length) {
    R.setState(this, {currentSlide: nextSlideIndex});
  }
};

Presentation.prototype.onAddSlide = function () {
  var slides = this.state.slides.slice(0);

  console.log('add slide');

  slides.push({});

  R.setState(this, {slides: slides, currentSlide: slides.length});
};

Presentation.prototype.onAddSlideTextItem = function () {
  console.log('onAddSlideTextItem');
};

Presentation.prototype.render = function() {
  var navigation,
      slides       = this.state.slides,
      currentSlide = this.state.currentSlide;

  navigation = R(Navigation, {
    onPrev: this.onNavigationPrev.bind(this),
    onNext: this.onNavigationNext.bind(this),
    currentSlide: currentSlide,
    totalSlides:  slides.length
  });

  return [
    R('h2', {innerHTML: 'Презентация № ' + this.props.number,  className: 'presentation-header'}),
  ].concat(
    currentSlide
      ? [R(Slide, {slide: slides[currentSlide - 1], key: currentSlide, onAddTextItem: this.onAddSlideTextItem.bind(this)})]
      : []
  )
  .concat(
    slides.length > 1 ? [navigation] : []
  ).concat([
    R('button', {innerHTML: '+ слайд', onClick: this.onAddSlide.bind(this), className: 'presentation-button-add'})
  ]);
};

module.exports = Presentation;
