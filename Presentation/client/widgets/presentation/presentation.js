var Presenteration,
    R      = require('renderer'),
    Slides = require('slides'),
    Navigation = require('navigation');

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

proto.onPrev = function () {

};


proto.render = function() {
  return [
    R('h2', {innerHTML: 'Презентация № ' + this.props.number,  className: 'presenter'}),
    R(Slides, {list: this.state.slides}),
    R(Navigation, {onPrev: this.onNavigationPrev.bind(this), onNext: this.onNavigationNext.bind(this)})
  ];
};

module.exports = Presentation;
