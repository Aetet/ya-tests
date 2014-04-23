var expect       = require('chai').expect;
    QueryEncoder = require('../QueryEncoder');

var testQuery = {
  search: 'test',
  unk: '',
  arr: ['t1', 't2', 't3'],
  'encoded&': '[z]'
};

var testQueryString = 'search=test&unk=&arr=t1&arr=t2&arr=t3&encoded%26=%5Bz%5D';
var wrongQuery = {
  test:  {a: 1},
  test2: '1'
};
var testUrl = 'http://ya.ru';

var testUrlWithQuery = 'http://ya.ru?param1=test&param2=test';

describe('QueryEncoder', function () {
  it('empty input argument should return a empty string', function () {
    expect(QueryEncoder(null)).to.be.a('string');
    expect(QueryEncoder(null)).to.be.empty;
  });

  it('should throw exception if query property is not a string or number or array', function () {
    expect(QueryEncoder.bind(null, wrongQuery)).to.throw(TypeError);
  });

  it('should throw exception if query is not an object', function () {
    expect(QueryEncoder.bind(null, 123)).to.throw(TypeError);
  });

  it('should return a string', function () {
    expect(QueryEncoder(testQuery)).to.be.a('string');
  });

  it('should return a non-empty valid string', function () {
    expect(QueryEncoder(testQuery)).to.be.an.equal(testQueryString);
  });

  it('should add query string to clean url', function () {
    var qs = QueryEncoder(testQuery, testUrl);
    expect(qs).to.be.an.equal(testUrl + '?' + testQueryString);
  });

  it('should add query string to url with query', function () {
    var qs = QueryEncoder(testQuery, testUrlWithQuery);
    expect(qs).to.be.an.equal(testUrlWithQuery + '&' + testQueryString);
  });

});
