'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('App', function() {

  it('should redirect index.html to index.html#/phones', function() {
    browser.get('/');
    browser.getLocationAbsUrl().then(function(url) {
        expect(url.split('#')[1]).toBe('/index');
      });
  });

  describe('App main view', function () {
    beforeEach(function() {
      browser.get('/');
    });

    it('should show welcome msg after success sign in', function () {
      expect(element(by.css('form#signinForm')).getAttribute('class')).not.toContain('ng-hide');
      expect(element(by.css('ul#loggedin-box')).getAttribute('class')).toContain('ng-hide');
      var login = element(by.model('credentials.login'));
      var password = element(by.model('credentials.password'));

      login.sendKeys('mateusz');
      password.sendKeys('superhaslo');

      element(by.css('button#signin-btn')).click();

      expect(element(by.css('form#signinForm')).getAttribute('class')).toContain('ng-hide');
      expect(element(by.css('ul#loggedin-box')).getAttribute('class')).not.toContain('ng-hide');
      expect(element(by.css('a#welcome-msg')).getText()).toBe('Welcome, mateusz.');
    });

  });

  // describe('Phone list view', function() {
  //
  //   beforeEach(function() {
  //     browser.get('app/index.html#/phones');
  //   });
  //
  //
  //   it('should filter the phone list as user types into the search box', function() {
  //
  //     var phoneList = element.all(by.repeater('phone in phones'));
  //     var query = element(by.model('query'));
  //
  //     expect(phoneList.count()).toBe(20);
  //
  //     query.sendKeys('nexus');
  //     expect(phoneList.count()).toBe(1);
  //
  //     query.clear();
  //     query.sendKeys('motorola');
  //     expect(phoneList.count()).toBe(8);
  //   });
  //
  //
  //   it('should be possible to control phone order via the drop down select box', function() {
  //
  //     var phoneNameColumn = element.all(by.repeater('phone in phones').column('{{phone.name}}'));
  //     var query = element(by.model('query'));
  //
  //     function getNames() {
  //       return phoneNameColumn.map(function(elm) {
  //         return elm.getText();
  //       });
  //     }
  //
  //     query.sendKeys('tablet'); //let's narrow the dataset to make the test assertions shorter
  //
  //     expect(getNames()).toEqual([
  //       "Motorola XOOM\u2122 with Wi-Fi",
  //       "MOTOROLA XOOM\u2122"
  //     ]);
  //
  //     element(by.model('orderProp')).findElement(by.css('option[value="name"]')).click();
  //
  //     expect(getNames()).toEqual([
  //       "MOTOROLA XOOM\u2122",
  //       "Motorola XOOM\u2122 with Wi-Fi"
  //     ]);
  //   });
  //
  //
  //   it('should render phone specific links', function() {
  //     var query = element(by.model('query'));
  //     query.sendKeys('nexus');
  //     element(by.css('.phones li a')).click();
  //     browser.getLocationAbsUrl().then(function(url) {
  //       expect(url.split('#')[1]).toBe('/phones/nexus-s');
  //     });
  //   });
  // });
  //
  //
  // describe('Phone detail view', function() {
  //
  //   beforeEach(function() {
  //     browser.get('app/index.html#/phones/nexus-s');
  //   });
  //
  //
  //   it('should display nexus-s page', function() {
  //     expect(element(by.binding('phone.name')).getText()).toBe('Nexus S');
  //   });
  //
  //
  //   it('should display the first phone image as the main phone image', function() {
  //     expect(element(by.css('img.phone')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
  //   });
  //
  //
  //   it('should swap main image if a thumbnail image is clicked on', function() {
  //     element(by.css('.phone-thumbs li:nth-child(3) img')).click();
  //     expect(element(by.css('img.phone')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.2.jpg/);
  //
  //     element(by.css('.phone-thumbs li:nth-child(1) img')).click();
  //     expect(element(by.css('img.phone')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
  //   });
  // });
});
