/**
 * Фрейм/плашка вокруг чего-либо, переданного через свойство children
 *
 * @param {Array}  props.children массив объектов HTMLElement
 * @param {String} props.className
 */
var Toolbar;

Toolbar = function (props) {
  this.props     = props;
  this.className = props.className || 'toolbar';
};

Toolbar.prototype.render = function () {
  return this.props.children;
};

module.exports = Toolbar;
