/**
 * Слайд - область с картинками, текстом, полями ввода текста и добавления картинки
 *
 * @param {Array}    items          массив с объектами слайда
 * @param {Number}   key            id индекс слайда
 * @param {Function} onAddTextItem  обработчик добавления нового текстового блока в слайд
 * @param {Function} onAddImageItem обработчик добавления нового блока с картинкой в слайд
 */
var Slide,
    R             = require('renderer'),
    Toolbar       = require('toolbar'),
    SlideItemList = require('./slide-item-list');

Slide = function (props) {
  this.props = props;
};

Slide.prototype.getInitialState = function () {
  return {
    // Внутрнее состояние, текст, который попадет в слайд при нажатии кнопки добавить
    textInputValue: ''
  };
};

Slide.prototype.getDefaultProps = function () {
  return {
    items: [],
    key: 0,
    onAddTextItem: function (key) {
      console.error('add slide text item ' + key);
    },
    onAddImageItem: function (key) {
      console.error('add slide image item ' + key);
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

Slide.prototype.onSlideItemImageEnter = function (e) {
  var file, reader;

  file   = e.target.files[0];
  reader = new FileReader();

  reader.onload = function (e) {
    this.onAddImageItem(e.target.result);
  }.bind(this);

  reader.readAsDataURL(file);
};

Slide.prototype.onAddImageItem = function (imageData) {
  this.props.onAddImageItem(this.props.key, imageData);
};

Slide.prototype.render = function () {
  var props = this.props;

  return R('div', {
    className: 'slide',
    children: [
      R('h3', {innerHTML: 'Слайд № ' + (props.key + 1), className: 'slide-header'}),
      R(SlideItemList, {items: props.items}),
      R(Toolbar, {
        children: [
          R('button', {innerHTML: '+ текст', onClick: this.onAddTextItem.bind(this), className: 'toolbar-add'}),
          R('input', {
            type:     'text',
            name:     'text-input',
            value:    this.state.textInputValue,
            onChange: this.onSlideItemTextEnter.bind(this),
            className: 'toolbar-input-text'
          }),
          R('input', {
            type:     'file',
            name:     'image-input',
            onChange: this.onSlideItemImageEnter.bind(this),
            className: 'toolbar-input-image'
          })
        ]
      })
    ]
  });
};

module.exports = Slide;
