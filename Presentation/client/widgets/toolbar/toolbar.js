var Toolbar;

Toolbar = function (props) {
  this.props     = props;
  this.className = props.className || 'toolbar';
};

Toolbar.prototype.render = function () {
  return this.props.children;
};

module.exports = Toolbar;
