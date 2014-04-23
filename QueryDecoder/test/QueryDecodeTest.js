var expect      = require('chai').expect,
    QueryDecode = require('../QueryDecode');

var wrongTestQueryString = 'searchqweq';
var testQueryString = 'search=test&dir=desc&unk=&arr[]=1&arr[]=test&encoded%26=z%5D';

describe('QueryDecode', function () {

  var query;
  beforeEach(function () {
    query = QueryDecode(testQueryString);
  });

  describe('invoke', function () {

    describe('return empty object', function () {
      it('should return empty object from null input', function () {
        var query = QueryDecode(null);
        expect(query).to.be.a('object');
        expect(query).to.be.empty;
      });

      it('should return an empty object if wrong input string', function () {
        var wrongQuery = QueryDecode(wrongTestQueryString);
        expect(wrongQuery).to.be.a('object');
        expect(wrongQuery).to.be.empty;
      });
    });

    describe('return an object', function () {
      it('should return an object', function () {
        expect(query).to.be.a('object');
      });

      it('should return filled object', function () {
        expect(query).not.to.be.empty;
      });

      it('should return object with some keys', function () {
        expect(query).to.have.keys(['search', 'dir', 'unk', 'arr[]', 'encoded&']);
      });

      it('should return object with regular values', function () {
        expect(query).to.have.property('search', 'test');
        expect(query).to.have.property('dir', 'desc');
        expect(query).to.have.property('unk', '');
      });
    });

    describe('array property', function () {
      var array;
      beforeEach(function () {
        array = query['arr[]'];
      });

      it('should return array property with two elements', function () {
        expect(array).to.be.a('array');
        expect(array).to.have.length(2);
      });

      it('should return array with defined elements', function () {
        expect(array[0]).to.have.equal('1');
        expect(array[1]).to.have.equal('test');
      });
    });

    describe('urlencoded', function () {
      it('should return encoded property with encoded value', function () {
        expect(query).to.have.property('encoded&', 'z]');
      });
    });
  });
});
