/**
 * Список презентаций
 *
 * @param {Array} presentations массив объектов презентаций
 *
 * @param {Function} onAddSlide(presentationKey) обработчик добавления нового слайда, presentationKey - id номер презентации
 * @param {Function} onAddSlideTextItem(presentationKey, slideKey, text) обработчик добавления текста в слайд,
 *                                                                       slideKey - id номер слайда, text - отображаемый текст
 * @param {Function} onAddSlideImageItem(presentationKey, slideKey, imageData) обработчик добавления картинки в слайд, imageData - dataUrl картинки
 * @param {Function} onNavigationPrev(presentationKey) обработчик кнопки назад в навигации
 * @param {Function} onNavigationNext(presentationKey) обработчик кнопки вперед в навигации
 */
var PresentationList,
    R = require('renderer');

PresentationList = function (props) {
  this.props     = props;
};

PresentationList.prototype.getDefaultProps = function () {
  return {
    presentations: [],
    onAddSlide: function () {
      console.error('set property onAddSlide');
    },
    onAddSlideTextItem:  function () {
      console.error('set property onAddSlideTextItem');
    },
    onAddSlideImageItem: function () {
      console.error('set property onAddSlideImageItem');
    },
    onNavigationPrev:    function () {
      console.error('set property onNavigationPrev');
    },
    onNavigationNext:    function () {
      console.error('set property onNavigationNext');
    },
  };
};

PresentationList.prototype.render = function () {
  var props = this.props;

  return R('div', {
    className: 'presentation_list',
    children: props.presentations.map(function(presentation, index) {
      return R(Presentation, {
        key:                 index,
        slides:              presentation.slides,
        currentSlide:        presentation.currentSlide,
        onAddSlide:          props.onAddSlide,
        onAddSlideTextItem:  props.onAddSlideTextItem,
        onAddSlideImageItem: props.onAddSlideImageItem,
        onNavigationPrev:    props.onNavigationPrev,
        onNavigationNext:    props.onNavigationNext
      });
    }.bind(this))
  });
};

module.exports = PresentationList;
