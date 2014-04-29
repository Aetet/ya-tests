var Slide,
    R         = require('renderer'),
    SlideItem = require('./slide-item');

Slide = function (props) {
  this.props = props;
  this.className = 'slide';
};

Slide.prototype.getInitialState = function () {
  return {
    textInputValue: ''
  };
};

Slide.prototype.getDefaultProps = function () {
  return {
    items: [],
    key: 0,
    onAddTextItem: function (key) {
      console.log('add slide item ' + key);
    }
  };
};

Slide.prototype.onSlideItemTextEnter = function (e) {
  this.state.textInputValue = e.target.value;
};

Slide.prototype.onAddTextItem = function () {
  var text = this.state.textInputValue;
  if (text) {
    this.props.onAddTextItem(this.props.key, text);
  }
};

Slide.prototype.render = function () {
  var props = this.props;

  return [
    R('h3', {innerHTML: 'Слайд № ' + (props.key + 1), className: 'slide-header'})
  ].concat(props.items.map(function (item, index) {
    return R(SlideItem, {item: item, key: index});
  })).concat([
    R('button', {innerHTML: '+ текст', onClick: this.onAddTextItem.bind(this), className: 'slide-button_text-add'}),
    R('input', {
      type:     'text',
      name:     'text-input',
      value:    this.state.textInputValue,
      onChange: this.onSlideItemTextEnter.bind(this),
      className: 'slide-input_text'
    })
  ]);
};

module.exports = Slide;
