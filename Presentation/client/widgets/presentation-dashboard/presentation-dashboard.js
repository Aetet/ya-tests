var PresentationDashboard,
    Presentation     = require('presentation'),
    Toolbar          = require('toolbar'),
    PresentationList = require('./presentation-list'),
    R                = require('renderer');

PresentationDashboard = function (props) {
  this.props     = props;
  this.className = 'presentation_dashboard';
};

PresentationDashboard.prototype.getDefaultProps = function () {
  return {
    storageKey: 'presentationDashboard',
    presentations: [{
      key: 0,
      slides: [],
      currentSlide: 0
    }],
  };
};

PresentationDashboard.prototype.getInitialState = function () {
  return {
    presentations: this.props.presentations.slice(0),
  };
};

PresentationDashboard.prototype.onAddPresentation = function (e) {
  var presentations = this.state.presentations.slice(0);

  presentations.push({
    key: presentations.length,
    slides: [],
    currentSlide: 0
  });

  console.log('test', presentations.length);
  R.setState(this, {presentations: presentations});
};

PresentationDashboard.prototype.onNavigationPrev = function (presentationKey) {
  var presentation   = this.state.presentations[presentationKey],
      prevSlideIndex = presentation.currentSlide - 1;

  console.log('prev slide');

  if (prevSlideIndex > 0) {
    presentation.currentSlide = prevSlideIndex;
    R.refresh(this);
  }
};

PresentationDashboard.prototype.onNavigationNext = function (presentationKey) {
  var presentation   = this.state.presentations[presentationKey],
      nextSlideIndex = presentation.currentSlide + 1;

  console.log('next slide');
  
  if (nextSlideIndex <= presentation.slides.length) {
    presentation.currentSlide = nextSlideIndex;
    R.refresh(this);
  }
};

PresentationDashboard.prototype.onAddSlide = function (presentationKey) {
  var presentation = this.state.presentations[presentationKey],
      slides       = presentation.slides;

  console.log('add slide');

  slides.push({
    items: []
  });

  presentation.currentSlide = slides.length;

  R.refresh(this);
};

PresentationDashboard.prototype.onAddSlideTextItem = function (presentationKey, slideKey, text) {
  var presentation = this.state.presentations[presentationKey],
      slide        = presentation.slides[slideKey];

  console.log('add slide text item');

  slide.items.push({
    type: 'text',
    text: text
  });

  R.refresh(this);
};

PresentationDashboard.prototype.onAddSlideImageItem = function (presentationKey, slideKey, imageData) {
  var presentation = this.state.presentations[presentationKey],
      slide        = presentation.slides[slideKey];

  console.log('add slide image item');

  slide.items.push({
    type:      'image',
    imageData: imageData
  });

  R.refresh(this);
};

PresentationDashboard.prototype.render = function () {
  var props = this.props,
      state = this.state;

  return [
    R('h1', {innerHTML: 'Презентации', className: 'presentation_dashboard-header'}),
    R(PresentationList, {
      presentations:       state.presentations,
      onAddSlide:          this.onAddSlide.bind(this),
      onAddSlideTextItem:  this.onAddSlideTextItem.bind(this),
      onAddSlideImageItem: this.onAddSlideImageItem.bind(this),
      onNavigationPrev:    this.onNavigationPrev.bind(this),
      onNavigationNext:    this.onNavigationNext.bind(this)
    })
    ].concat([
      R(Toolbar, {
        className: 'toolbar',
        children: [
          R('button', {
            innerHTML: '+ презентация',
            onClick:   this.onAddPresentation.bind(this),
            className: 'toolbar-button'
          })
        ]
      })
    ]);
};

module.exports = PresentationDashboard;
