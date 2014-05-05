describe('renderer-test', function () {
  var TestElement,
      testElement,
      replaceStub,
      renderStub,
      oldEl,
      component,
      oldcreateElement,
      R = require('renderer');

  TestElement = function () {
    this.className = 'test';
  };

  TestElement.prototype.render = function () {
    return Renderer('div', {
      children: [
        Renderer('span', {innerHTML: this.props.title, className: 'subheader'})
      ]
    });
  };

  beforeEach(function () {
    oldcreateElement = R.createElement;
    testElement = {
      parentNode: {
        replaceChild: replaceStub
      },
      addEventListener: sinon.spy(),
      appendChild: sinon.spy()
    };
    
    R.createElement  = sinon.spy(function () {
      return testElement;
    });

    replaceStub = sinon.spy();
    renderStub = function () {
      return {};
    };
    oldEl = {
      parentNode: {
        replaceChild: replaceStub
      }
    };
    component = {
      el: oldEl,
      render: sinon.spy(renderStub)
    };
  });

  afterEach(function () {
    R.createElement = oldcreateElement;
  });

  it('should render simple dom element', function () {
    var attributes = {
        className: 'xexe',
        innerHTML: 'test123'
      },
      testElement = {
        qwe: '123'
      };

    R.createElement  = sinon.spy(function () {
      return testElement;
    });

    var result = R('div', attributes);

    expect(R.createElement).to.be.calledOnce();
    expect(result).not.to.be.equal(attributes);
    expect(result.className).to.be.equal(attributes.className);
    expect(result.qwe).to.be.equal(testElement.qwe);
  });

  it('should call refresh method', function () {
    R.refresh(component);
    expect(component.render).to.be.calledOnce();
    expect(replaceStub).to.be.calledWith(component.el, oldEl);
  });

  it('should call setState method', function () {
    var state = {
      test: '123'
    };
    R.setState(component, state);
    expect(component).to.have.property('state');
    expect(component.state).to.be.deep.equal(state);
    expect(component.render).to.be.calledOnce();
  });
});
