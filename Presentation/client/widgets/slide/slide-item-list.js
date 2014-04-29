var SlideItemList,
    R = require('renderer'),
    SlideItem = require('./slide-item');

SlideItemList = function (props) {
  this.props     = props;
  this.className = 'slide_item_list';
};

SlideItemList.prototype.getDefaultProps = function () {
  return {
    items: []
  };
};

SlideItemList.prototype.render = function () {
  return this.props.items.map(function (item, index) {
    return R(SlideItem, {item: item, key: index});
  }.bind(this));
};

module.exports = SlideItemList;
