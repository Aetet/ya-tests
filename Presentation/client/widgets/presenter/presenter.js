var Presenter,
    Presentation = require('presentation'),
    R            = require('renderer');

Presenter = function (props) {
  this.props = props;
  this.state = {
    number: 1,
  };
};

Presenter.prototype.getDefaultProps = function () {
  return {
    storageKey: 'presenter'
  };
};

Presenter.prototype.onAddPresentation = function (e) {
  R.setState(this, {number: this.state.number + 1});
};

Presenter.prototype.render = function () {
  return [
    R('h1', {innerHTML: 'Презентации'}),
    R(Presentation, {number: this.state.number, storageKey: this.props.storageKey}),
    R('button', {innerHTML: '+', onClick: this.onAddPresentation.bind(this)})
  ];
};

module.exports = Presenter;
