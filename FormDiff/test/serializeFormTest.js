var expect        = require('chai').expect,
    serializeForm = require('../src/formDiff').serializeForm;
/**
 * В идеале надо тестировать serializeForm на реальной форме, через браузер, для упрощения ограничимся заглушкой
 */
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
  ]
};

describe('formDiff.serializeForm', function () {
  var result = serializeForm(formMock);

  it('should throw exception if not an html form oject given', function () {
    expect(serializeForm.bind(null, 0)).to.throw(TypeError);
    expect(serializeForm.bind(null, null)).to.throw(TypeError);
    expect(serializeForm.bind(null, {})).to.throw(TypeError);
    expect(serializeForm.bind(null, '')).to.throw(TypeError);
    expect(serializeForm.bind(null, false)).to.throw(TypeError);
  });

  it('should return an object', function () {
    expect(result).to.be.a('object');
  });

  it('should return a text value property', function () {
    expect(result).to.have.property('email');
    expect(result.email).to.be.equal('test@ya.ru');
  });

  it('should return a radio value property', function () {
    expect(result).to.have.property('gender');
    expect(result.gender).to.be.equal('male');
  });

  it('should return a single list property', function () {
    expect(result).to.have.property('list');
    expect(result.list).to.be.equal('test1');
  });

  it('should return a multi checkbox value as array', function () {
    expect(result).to.have.property('task');
    expect(result.task).to.be.a('array');
    expect(result.task).to.have.length(1);
    expect(result.task[0]).to.be.a.equal('task1');
  });

  it('should return a multi select value', function () {
    expect(result).to.have.property('tickets');
    expect(result.tickets).to.be.a('array');
    expect(result.tickets).to.have.length(2);
    expect(result.tickets[0]).to.be.an.equal(1);
    expect(result.tickets[1]).to.be.an.equal(3);
  });
});
