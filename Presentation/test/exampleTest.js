var expect  = require('chai').expect,
    Browser = require('zombie'),
    browser = new Browser();

describe('Loads pages', function(){

    it('Google.com', function(done){

        browser.visit("http://www.google.com", function () {
            expect(browser.text("title")).to.equal('Google');
            done();
        });
    });

});