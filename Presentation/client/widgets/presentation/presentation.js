var Presenteration,
    R          = require('renderer'),
    Slide      = require('slide'),
    Navigation = require('navigation');

Presentation = function (props) {
  this.props     = props;
  this.className = 'presentation';
};

Presentation.prototype.getDefaultProps = function () {
  return {
    key: 0,
    slides: [],
    currentSlide: 0,
    onAddSlide: function (presentationKey) {
      console.log('add slide ' + presentationKey);
    },
    onAddSlideTextItem: function (presentationKey, slideKey) {
      console.log('add slide text item for presentation ' + presentationKey, ' and slide ' + slideKey);
    },
    onNavigationPrev: function (presentationKey) {
      console.log('prev slide ' + presentationKey);
    },
    onNavigationNext: function (presentationKey) {
      console.log('next slide ' + presentationKey);
    }
  };
};

Presentation.prototype.onNavigationPrev = function () {
  this.props.onNavigationPrev(this.props.key);
};

Presentation.prototype.onNavigationNext = function () {
  this.props.onNavigationNext(this.props.key);
};

Presentation.prototype.onAddSlide = function () {
  this.props.onAddSlide(this.props.key);
};

Presentation.prototype.onAddSlideTextItem = function (slideKey, text) {
  this.props.onAddSlideTextItem(this.props.key, slideKey, text);
};

Presentation.prototype.render = function() {
  var slides            = this.props.slides,
      currentSlideIndex = this.props.currentSlide,
      currentSlide      = slides[this.props.currentSlide - 1],
      number            = this.props.key + 1;

  return [
    R('h2', {innerHTML: 'Презентация № ' + number,  className: 'presentation-header'})
  ]
  .concat(
    currentSlideIndex
      ? [R(Slide, {
          items:         currentSlide.items,
          key:           currentSlideIndex - 1,
          onAddTextItem: this.onAddSlideTextItem.bind(this)
        })]
      : []
  )
  .concat(
    slides.length > 1
      ? [R(Navigation, {
          onPrev:       this.onNavigationPrev.bind(this),
          onNext:       this.onNavigationNext.bind(this),
          currentSlide: currentSlideIndex,
          totalSlides:  slides.length
        })]
      : []
  )
  .concat([
    R('button', {
      innerHTML:  '+ слайд',
      onClick:    this.onAddSlide.bind(this),
      className: 'presentation-button-add'
    })
  ]);
};

module.exports = Presentation;
