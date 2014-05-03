/**
 * Элемент слайда - блок с картинкой или текстом
 *
 * @param {Number}           key            индекс элемента слайда в массиве элементов
 * @param {String}           item.type      тип элемента: text или image
 * @param {String|undefined} item.text      текстовая строка, в случае, если тип элемента text
 * @param {String|undefined} item.imageData dataUrl картинки, в случае, если тип элемента image
 */
var SlideItem,
    R = require('renderer');

SlideItem = function (props) {
  this.props = props;
};

SlideItem.prototype.getDefaultProps = function () {
  return {
    key: 0,
    item: {text: 'example text', type: 'text'}
  };
};

SlideItem.prototype.render = function () {
  var item = this.props.item;

  return R('div', {
    className: 'slide_item',
    children: item.type === 'text'
      ? [R('p', {innerHTML: item.text, className: 'slide_item-text'})]
      : [R('img', {src: item.imageData, className: 'slide_item-image'})]
  });
};

module.exports = SlideItem;
