var expect      = require('chai').expect,
    diffObjects = require('../src/formDiff').diffObjects;

describe('formDiff.diffObjects', function () {
  it('should throw exception if not an oject given', function () {
    expect(diffObjects.bind(null, 0, 0)).to.throw(TypeError);
    expect(diffObjects.bind(null, null, null)).to.throw(TypeError);
    expect(diffObjects.bind(null, '', '')).to.throw(TypeError);
    expect(diffObjects.bind(null, false, false)).to.throw(TypeError);
  });

  describe('compare objects result', function () {
    var objects = [
      {test: 'v1', arr: [1, 2, 3], email: 'test2'},
      {test: 'v2', newValue: 'v3', arr: [1, 4, 'test']}
    ];
    var result = diffObjects(objects[0], objects[1]);

    it('should be an array with length two', function () {
      expect(result).to.be.a('array');
      expect(result).to.have.length(4);
    });

    describe('scalar value change row', function () {
      var value = result[0];
      it('should return have all keys', function () {
        expect(value).to.have.keys(['name', 'from', 'to', 'operation', 'type']);
      });

      it('should return operation', function () {
        expect(value.operation).to.be.equal('change');
      });

      it('should return a type scalar', function () {
        expect(value.type).to.be.equal('scalar');
      });

      it('should return a valid from-to', function () {
        expect(value.from).to.be.equal('v1');
        expect(value.to).to.be.equal('v2');
      });

      it('should return a valid name', function () {
        expect(value.name).to.be.equal('test');
      });
    });

    describe('scalar value add row', function () {
      var value = result[3];
      it('should return have all keys', function () {
        expect(value).to.have.keys(['name', 'from', 'to', 'operation', 'type']);
      });

      it('should return operation', function () {
        expect(value.operation).to.be.equal('add');
      });

      it('should return a type scalar', function () {
        expect(value.type).to.be.equal('scalar');
      });

      it('should return a valid from-to', function () {
        expect(value.from).to.be.undefined;
        expect(value.to).to.be.equal('v3');
      });

      it('should return a valid name', function () {
        expect(value.name).to.be.equal('newValue');
      });
    });

    describe('scalar value delete row', function () {
      var value = result[2];
      it('should return have all keys', function () {
        expect(value).to.have.keys(['name', 'from', 'to', 'operation', 'type']);
      });

      it('should return operation', function () {
        expect(value.operation).to.be.equal('delete');
      });

      it('should return a type scalar', function () {
        expect(value.type).to.be.equal('scalar');
      });

      it('should return a valid from-to', function () {
        expect(value.to).to.be.undefined;
        expect(value.from).to.be.equal('test2');
      });

      it('should return a valid name', function () {
        expect(value.name).to.be.equal('email');
      });
    });

    describe('array value change row', function () {
      var value = result[1];
      it('should return have all keys', function () {
        expect(value).to.have.keys(['name', 'from', 'to', 'operation', 'type', 'arrayAdded', 'arrayDeleted']);
      });

      it('should return operation', function () {
        expect(value.operation).to.be.equal('change');
      });

      it('should return a type array', function () {
        expect(value.type).to.be.equal('array');
      });

      it('should return arrayAdded', function () {
        expect(value.arrayAdded).to.have.members([4, 'test']);
      });
      it('should return arrayDeleted', function () {
        expect(value.arrayDeleted).to.have.members([2, 3]);
      });
    });

  });

});

