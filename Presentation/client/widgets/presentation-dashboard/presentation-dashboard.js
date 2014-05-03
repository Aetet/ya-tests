/**
 * Область, в которой отображается список презентаций и блок с кнопкой добавить презентацию
 *
 * Единственный statefull widget, хранит состояние всей страницы
 *
 * props:
 *
 * @param {Array|undefined} presentations массив презентаций
 *
 * @example
 *
 * var presentations = [
 *   {
 *     currentSlide: 0,
 *     slides: [
 *       {
 *         items: [
 *           {
 *             type: 'text',
 *             text: 'hello'
 *           }
 *         ]
 *       }
 *     ]
 *   }
 * ];
 */
var PresentationDashboard,
    Presentation     = require('presentation'),
    Toolbar          = require('toolbar'),
    PresentationList = require('./presentation-list'),
    R                = require('renderer');

PresentationDashboard = function (props) {
  this.props     = props;
};

PresentationDashboard.prototype.getDefaultProps = function () {
  return {
    presentations: [{
      slides: [],
      currentSlide: 0
    }],
  };
};

PresentationDashboard.prototype.getInitialState = function () {
  return {
    presentations: this.props.presentations.slice(0),
  };
};

/**
 * Обработчик добавления презентации
 *
 * Добавляет пустую презентацию без слайдов
 */
PresentationDashboard.prototype.onAddPresentation = function () {
  var presentations = this.state.presentations.slice(0);

  presentations.push({
    slides: [],
    currentSlide: 0
  });

  console.log('test', presentations.length);
  R.setState(this, {presentations: presentations});
};

/**
 * Обработчик нажатия кнопки "назад" в навигации
 *
 * @param {Number} presentationKey индекс презентации в массиве презентаций
 */
PresentationDashboard.prototype.onNavigationPrev = function (presentationKey) {
  var presentation   = this.state.presentations[presentationKey],
      prevSlideIndex = presentation.currentSlide - 1;

  console.log('prev slide');

  if (prevSlideIndex > 0) {
    presentation.currentSlide = prevSlideIndex;
    R.refresh(this);
  }
};

/**
 * Обработчик нажатия кнопки "вперед" в навигации
 *
 * @param {Number} presentationKey индекс презентации в массиве презентаций
 */
PresentationDashboard.prototype.onNavigationNext = function (presentationKey) {
  var presentation   = this.state.presentations[presentationKey],
      nextSlideIndex = presentation.currentSlide + 1;

  console.log('next slide');

  if (nextSlideIndex <= presentation.slides.length) {
    presentation.currentSlide = nextSlideIndex;
    R.refresh(this);
  }
};

/**
 * Обработчик добавления слайда в презентацию
 *
 * @param {Number} presentationKey индекс презентации в массиве презентаций
 */
PresentationDashboard.prototype.onAddSlide = function (presentationKey) {
  var presentation = this.state.presentations[presentationKey],
      slides       = presentation.slides;

  console.log('add slide');

  slides.push({
    items: []
  });

  presentation.currentSlide = slides.length;

  R.refresh(this);
};

/**
 * Обработчик добавления текстового блока в слайд
 *
 * @param {Number} presentationKey индекс презентации в массиве презентаций
 * @param {Number} slideKey        индекс слайда в массиве presentation.slides
 * @param {String} text            текст блока
 */
PresentationDashboard.prototype.onAddSlideTextItem = function (presentationKey, slideKey, text) {
  var presentation = this.state.presentations[presentationKey],
      slide        = presentation.slides[slideKey];

  console.log('add slide text item');

  slide.items.push({
    type: 'text',
    text: text
  });

  R.refresh(this);
};

/**
 * Обработчик добавления блока с картинкой в слайд
 *
 * @param {Number} presentationKey индекс презентации в массиве презентаций
 * @param {Number} slideKey        индекс слайда в массиве presentation.slides
 * @param {String} imageData       dataUrl картинки
 */
PresentationDashboard.prototype.onAddSlideImageItem = function (presentationKey, slideKey, imageData) {
  var presentation = this.state.presentations[presentationKey],
      slide        = presentation.slides[slideKey];

  console.log('add slide image item');

  slide.items.push({
    type:      'image',
    imageData: imageData
  });

  R.refresh(this);
};

PresentationDashboard.prototype.render = function () {
  var props = this.props,
      state = this.state;

  return R('div', {
    className: 'presentation_dashboard',
    children: [
      R(PresentationList, {
        presentations:       state.presentations,
        onAddSlide:          this.onAddSlide.bind(this),
        onAddSlideTextItem:  this.onAddSlideTextItem.bind(this),
        onAddSlideImageItem: this.onAddSlideImageItem.bind(this),
        onNavigationPrev:    this.onNavigationPrev.bind(this),
        onNavigationNext:    this.onNavigationNext.bind(this)
      }),
      R(Toolbar, {
        className: 'toolbar',
        children: [
          R('button', {
            innerHTML: '+ презентация',
            onClick:   this.onAddPresentation.bind(this),
            className: 'toolbar-button'
          })
        ]
      })
    ]
  });
};

module.exports = PresentationDashboard;
