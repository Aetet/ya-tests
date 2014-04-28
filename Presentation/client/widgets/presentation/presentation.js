var Presenteration,
    R      = require('renderer'),
    Slides = require('slides');

Presentation = function (props) {
  this.props = props;
};

var proto = Presentation.prototype;

proto.getDefaultProps = function () {
  return {
    number: 1
  };
};

proto.getInitialState = function () {
  return {
    slides: []
  };
};

proto.componentDidMount = function () {

};


proto.render = function() {
  return [
    R('h2', {innerHTML: 'Презентация № ' + this.props.number,  className: 'presenter'}),
    R(Slides, {list: this.state.slides})
  ];
};

module.exports = Presentation;
