describe('navigation', function () {
  var Navigation = require('navigation'),
      expect     = chai.expect,
      render     = require('test-utils').render;

  it('should be an object', function () {
    expect(Navigation).to.be.a('function');
  });

  it('should have a "no slides" message if totalSlides is null', function (done) {
    render(Navigation, {}, function (el) {
      expect($('.navigation-button-noButtons', el)).to.have.a.text('нет ни одного слайда');
      done();
    });
  });

  describe('actions', function () {
    var el, nextSpy, prevSpy;

    beforeEach(function () {
      nextSpy = sinon.spy();
      prevSpy = sinon.spy();

      el = render(Navigation, {
        onNext: nextSpy,
        onPrev: prevSpy,
        currentSlide: 1,
        totalSlides: 3
      });

    });

    it('should trigger onNext callbacks on next button click', function () {
      $('.navigation-button-next', el).click();
      expect(nextSpy).to.be.calledOnce();
      expect(prevSpy).not.to.be.called();
    });

    it('should trigger onPrev callbacks on prev button click', function () {
      $('.navigation-button-prev', el).click();
      expect(prevSpy).to.be.calledOnce();
      expect(nextSpy).not.to.be.called();
    });

  });

});
