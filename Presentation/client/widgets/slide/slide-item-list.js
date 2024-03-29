/**
 * Список элементов слайда - область с картинками, текстом
 *
 * @param {Array}    items массив с объектами слайда
 */
 var SlideItemList,
    R         = require('renderer'),
    SlideItem = require('./slide-item');

SlideItemList = function (props) {
  this.props = props;
};

SlideItemList.prototype.getDefaultProps = function () {
  return {
    items: []
  };
};

SlideItemList.prototype.render = function () {
  return R('div', {
    className: 'slide_item_list',
    children: this.props.items.map(function (item, index) {
      return R(SlideItem, {item: item, key: index});
    }.bind(this))
  });
};

module.exports = SlideItemList;
