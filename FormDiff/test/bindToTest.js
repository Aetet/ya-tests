var chai      = require('chai'),
    expect    = chai.expect,
    sinon     = require('sinon'),
    bindTo    = require('../js/formDiff').bindTo,
    sinonChai = require('sinon-chai');

chai.expect();
chai.use(sinonChai);

var formMock = {
  nodeName: 'FORM',
  elements: [
    {
      name: 'email',
      type: 'text',
      value: 'test@ya.ru',
      dataset: {},
    },
    {
      name: 'gender',
      type: 'radio',
      value: 'male',
      dataset: {},
      checked: true
    },
    {
      name: 'task',
      type: 'checkbox',
      dataset: {multiple: 1},
      value: 'task1',
      checked: true
    },
    {
      name: 'task',
      type: 'checkbox',
      dataset: {multiple: 1},
      value: 'task2'
    },
    {
      name: 'list',
      type: 'select',
      value: 'test1',
      dataset: {},
    },
    {
      name: 'tickets',
      type: 'select-multiple',
      dataset: {},
      options: [
        {selected: true,  value: 1},
        {selected: false, value: 2},
        {selected: true,  value: 3},
        {selected: false, value: 4}
      ]
    }
  ],
  addEventListener: function () {}
};

describe('formDiff.bindTo', function () {
  var savedAddEventListener;
  beforeEach(function () {
    savedAddEventListener     = formMock.addEventListener;
    formMock.addEventListener = sinon.spy(formMock.addEventListener);
  });
  afterEach(function () {
    formMock.addEventListener = savedAddEventListener;
    formMock.addEventListener = sinon.spy(formMock.addEventListener);
  });

  var logSpy  = sinon.spy();

  it('should add submit event listener to', function () {
    bindTo(formMock);
    expect(formMock.addEventListener).to.have.been.calledWith('submit');
  });
});
