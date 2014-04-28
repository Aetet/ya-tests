var Presenter,
    Presentation = require('presentation'),
    R            = require('renderer'),
    format       = require('format');

Presenter = function (props) {
  this.props = props;
};



Presenter.prototype.getDefaultProps = function () {
  return {
    storageKey: 'presenter'
  };
};

Presenter.prototype.onAddPresentation = function (e) {

};

Presenter.prototype.render = function (el) {
  return [
    R('h1', 'Презентации'),
    R(Presentation, {storageKey: this.props.storageKey}),
    R('button', '+').addEventListener('click', this.onAddPresentation.bind(this))
  ];
};

module.exports = Presenter;
