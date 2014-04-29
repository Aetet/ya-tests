var SlideItem,
    R = require('renderer');

SlideItem = function (props) {
  this.props     = props;
  this.className = 'slide_item';
};

SlideItem.prototype.getDefaultProps = function () {
  return {
    key: 0,
    item: {text: 'example text', type: 'text'}
  };
};

SlideItem.prototype.render = function () {
  var item = this.props.item;

  return [
    item.type === 'text'
      ? R('p', {innerHTML: item.text, className: 'slide_item-text'})
      : R('img', {src: item.imageData, className: 'slide_item-image'})
  ];
};

module.exports = SlideItem;
