var Slide,
    R         = require('renderer'),
    SlideItem = require('./slide-item');

Slide = function (props) {
  this.props = props;
  this.className = 'slide';
};

Slide.prototype.getDefaultProps = function () {
  return {
    items: [],
    onAddTextItem: function () {
      console.log('add slide item');
    }
  };
};

Slide.prototype.render = function () {
  return [
    R('h3', {innerHTML: 'Слайд № ' + this.props.key, className: 'slide-header'})
  ].concat(this.props.items.map(function (item, index) {
    return R(SlideItem, {item: item, key: index});
  })).concat([
    R('button', {innerHTML: '+ текст', onClick: this.props.onAddTextItem, className: 'slide-button_text-add'})
  ]);
};

module.exports = Slide;
