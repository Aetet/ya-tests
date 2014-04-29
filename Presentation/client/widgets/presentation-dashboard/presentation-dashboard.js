var PresentationDashboard,
    Presentation = require('presentation'),
    R            = require('renderer');

PresentationDashboard = function (props) {
  this.props = props;
  this.className = 'presentation_dashboard';
};

PresentationDashboard.prototype.getDefaultProps = function () {
  return {
    storageKey: 'presentationDashboard',
    presentations: [{}],
  };
};

PresentationDashboard.prototype.getInitialState = function () {
  return {
    presentations: this.props.presentations.slice(0),
  };
};

PresentationDashboard.prototype.onAddPresentation = function (e) {
  var presentations = this.state.presentations.slice(0);
  presentations.push({});
  console.log('test', presentations.length);
  R.setState(this, {presentations: presentations});
};

PresentationDashboard.prototype.render = function () {
  var props = this.props,
      state = this.state;

  return [
    R('h1', {innerHTML: 'Презентации', className: 'presentation_dashboard-header'})
  ].concat(state.presentations.map(function(presentation, index) {
    return R(Presentation, {number: index + 1, presentation: presentation});
  })).concat([
    R('button', {innerHTML: '+ презентация', onClick: this.onAddPresentation.bind(this), className: 'presentation_dashboard-button-add'})
  ]);
};

module.exports = PresentationDashboard;
