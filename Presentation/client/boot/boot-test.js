describe('boot', function () {
  var boot   = require('boot'),
      expect = chai.expect;

  it('should be an object', function () {
    expect(boot).to.be.a('object');
  });
});
