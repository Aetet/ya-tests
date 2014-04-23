var expect       = require('chai').expect;
    QueryEncoder = require('../QueryEncoder');

var testQuery = {
  search: 'test',
  unk: '',
  arr: ['t1', 't2', 't3'],
  'encoded&': '[z]'
};

var testQueryString = 'search=test&unk=&arr=t1&arr=t2&arr=t3&encoded%26=%5Bz%5D';

describe('QueryEncoder', function () {
  var queryString;

  beforeEach(function () {
    queryString = QueryEncoder(testQuery);
  });

  it('should return a string', function () {
    expect(queryString).to.be.a('string');
  });

  it('should return a non-empty valid string', function () {
    expect(queryString).to.be.an.equal(testQueryString);
  });
});
