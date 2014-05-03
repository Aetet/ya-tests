/**
 * Фрейм/плашка вокруг чего-либо, переданного через свойство children
 *
 * @param {Array}  props.children массив объектов HTMLElement
 * @param {String} props.className
 */
var Toolbar,
    R = require('renderer');

Toolbar = function (props) {
  this.props     = props;
};

Toolbar.prototype.getDefaultProps = function () {
  return {
    className: 'toolbar'
  };
};

Toolbar.prototype.render = function () {
  return R('div', {
    className: this.props.className,
    children: this.props.children
  });
};

module.exports = Toolbar;
