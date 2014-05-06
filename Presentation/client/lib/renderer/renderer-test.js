describe('renderer-test', function () {
  var TestElement,
      DOMElementStub,
      oldDOMElementStub,
      componentStub,
      oldcreateElement,
      R = require('renderer');

  beforeEach(function () {
    oldcreateElement = R.createElement;

    DOMElementStub = {
      parentNode: {
        replaceChild: sinon.spy()
      },
      addEventListener: sinon.spy(),
      appendChild: sinon.spy()
    };

    oldDOMElementStub = {
      parentNode: {
        replaceChild: sinon.spy()
      }
    };

    R.createElement  = sinon.spy(function () {
      return DOMElementStub;
    });

    componentStub = {
      el: oldDOMElementStub,
      render: sinon.spy(function () {
        return {};
      })
    };
  });

  afterEach(function () {
    R.createElement = oldcreateElement;
  });

  describe('DOM element', function () {
    it('should render dom element with attributes', function () {
      var attributes = {
          className: 'xexe',
          innerHTML: 'test123'
        };

      var result = R('div', attributes);

      expect(result).to.be.equal(DOMElementStub);
      expect(R.createElement).to.be.calledOnce();
      expect(R.createElement).to.has.been.returned(DOMElementStub);
      expect(result.className).to.be.equal(attributes.className);
      expect(result.innerHTML).to.be.equal(attributes.innerHTML);
    });

    it('should attach events to dom element', function () {
      var attributes = {
        innerHTML: 'test',
        onClick:   sinon.spy(),
        onChange:  sinon.spy()
      };

      var result = R('div', attributes);

      expect(DOMElementStub.addEventListener).to.be.calledWith('click', attributes.onClick);
      expect(DOMElementStub.addEventListener).to.be.calledWith('change', attributes.onChange);
    });

    it('should append children to dom element', function () {
      var attributes = {
        innerHTML: 'test',
        children: [
          {className: 'el1'},
          {className: 'el2'},
          {className: 'el3'},
        ]
      };

      var result = R('div', attributes);
      expect(DOMElementStub.appendChild).to.have.callCount(3);
    });

    it('should call refresh method', function () {
      R.refresh(componentStub);
      expect(componentStub.render).to.be.calledOnce();
      expect(oldDOMElementStub.parentNode.replaceChild).to.be.calledWith(componentStub.el, oldDOMElementStub);
    });

    it('should call setState method', function () {
      var state = {
        test: '123'
      };
      R.setState(componentStub, state);
      expect(componentStub).to.have.property('state');
      expect(componentStub.state).to.be.deep.equal(state);
      expect(componentStub.render).to.be.calledOnce();
    });
  });

  describe('Component', function () {
    var oldcreateElement;
    beforeEach(function() {
      oldcreateElement = R.createElement;

      R.createElement  = sinon.spy(function (name) {
        var el = Object.create(DOMElementStub);
        el.name = name;
        el.children = [];
        el.appendChild = function (el) {
          this.children.push(el);
        };

        return el;
      });

      TestElement = function () {};
      TestElement.prototype.render = function () {
        return R('div', {
          className: 'testblock',
          children: [
            R('h3', {innerHTML: this.props.title, className: 'subheader'})
          ]
        });
      };
    });


    afterEach(function () {
      R.createElement = oldcreateElement;
    });

    it('should create dom element from component', function () {
      var props  = {title: 'test title'};
      var result = R(TestElement, props);
      expect(R.createElement).to.have.callCount(2);
      expect(result).to.have.property('name');
      expect(result.name).to.be.equal('div');
      expect(result.className).to.be.equal('testblock');
      expect(result).to.have.property('children');
      expect(result.children).to.be.a('array');
      expect(result.children).to.have.length(1);
    });
  });
});
