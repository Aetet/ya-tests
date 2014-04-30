/**
 * Презентация с активным слайдом и навигацией-переключателем по слайдам
 *
 * props:
 *
 * @param {Number}   key          id номер презентации
 * @param {Array}    slides       массив слайдов
 * @param {Number}   currentSlide текущий слайд
 *
 * @param {Function} onAddSlide(presentationKey) обработчик добавления нового слайда, presentationKey - id номер презентации
 * @param {Function} onAddSlideTextItem(presentationKey, slideKey, text) обработчик добавления текста в слайд,
 *                                                                       slideKey - id номер слайда, text - отображаемый текст
 * @param {Function} onAddSlideImageItem(presentationKey, slideKey, imageData) обработчик добавления картинки в слайд, imageData - dataUrl картинки
 * @param {Function} onNavigationPrev(presentationKey) обработчик кнопки назад в навигации
 * @param {Function} onNavigationNext(presentationKey) обработчик кнопки вперед в навигации
 */
var Presenteration,
    R          = require('renderer'),
    Slide      = require('slide'),
    Toolbar    = require('toolbar'),
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
      console.error('add slide ' + presentationKey);
    },
    onAddSlideTextItem: function (presentationKey, slideKey, text) {
      console.error('add slide text item for presentation ' + presentationKey, ' and slide ' + slideKey);
    },
    onAddSlideImageItem: function (presentationKey, slideKey, imageData) {
      console.error('add slide image item for presentation ' + presentationKey, ' and slide ' + slideKey);
    },
    onNavigationPrev: function (presentationKey) {
      console.error('prev slide ' + presentationKey);
    },
    onNavigationNext: function (presentationKey) {
      console.error('next slide ' + presentationKey);
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

Presentation.prototype.onAddSlideImageItem = function (slideKey, imageData) {
  this.props.onAddSlideImageItem(this.props.key, slideKey, imageData);
};

Presentation.prototype.render = function() {
  var slides            = this.props.slides,
      currentSlideIndex = this.props.currentSlide,
      currentSlide      = slides[this.props.currentSlide - 1],
      number            = this.props.key + 1;

  return [
    R('h2', {innerHTML: 'Презентация № ' + number,  className: 'presentation-header'}),
    R('div', {
      className: 'presentation-slideWrapper',
      children: (
        (currentSlideIndex ? [
          R(Slide, {
            items:          currentSlide.items,
            key:            currentSlideIndex - 1,
            onAddTextItem:  this.onAddSlideTextItem.bind(this),
            onAddImageItem: this.onAddSlideImageItem.bind(this),
          })
        ]: [])
      )
    })
  ].concat([
    R(Toolbar, {
      className: 'presentation-navigation',
      children: [
        R(Navigation, {
          onPrev:       this.onNavigationPrev.bind(this),
          onNext:       this.onNavigationNext.bind(this),
          currentSlide: currentSlideIndex,
          totalSlides:  slides.length
        })
      ]
    }),

    R(Toolbar, {
      children: [
        R('button', {
          innerHTML:  '+ слайд',
          onClick:    this.onAddSlide.bind(this),
          className: 'toolbar-add'
        })
      ]
    })
  ]);
};

module.exports = Presentation;
