var SlideItem,
    R = require('renderer');

SlideItem = function (props) {
  this.props     = props;
  this.className = 'slide_item';
};

SlideItem.prototype.getDefaultProps = function () {
  return {
    key: 0,
    item: {text: 'example text'}
  };
};

SlideItem.prototype.render = function () {
  var item = this.props.item;

  return [
    R('p', {innerHTML: item.text, className: 'slide_item-text'})
  ];
};

module.exports = SlideItem;
