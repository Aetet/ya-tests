var PresentationList,
    R = require('renderer');

PresentationList = function (props) {
  this.props     = props;
  this.className = 'presentation_list';
  this.root      = 'ul';
};

PresentationList.prototype.getDefaultProps = function () {
  return {
    presentations: [],
    onAddSlide: null,
    onAddSlideTextItem:  null,
    onAddSlideImageItem: null,
    onNavigationPrev:    null,
    onNavigationNext:    null
  };
};

PresentationList.prototype.render = function () {
  var props = this.props;

  return props.presentations.map(function(presentation, index) {
    return R(Presentation, {
      key:                 index,
      slides:              presentation.slides,
      currentSlide:        presentation.currentSlide,
      onAddSlide:          props.onAddSlide,
      onAddSlideTextItem:  props.onAddSlideTextItem,
      onAddSlideImageItem: props.onAddSlideImageItem,
      onNavigationPrev:    props.onNavigationPrev,
      onNavigationNext:    props.onNavigationNext
    });
  }.bind(this));
};

module.exports = PresentationList;
