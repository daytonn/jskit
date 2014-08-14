require("./spec_helper");
require("../lib/jskit");
var Application = require("../lib/application");

describe("JSKit", function() {
  var subject;
  beforeEach(function() {
    subject = JSKit;
  });

  describe("createApplication", function() {
    var app;
    beforeEach(function() {
      app = subject.createApplication();
    });

    it("creates an application", function() {
      expect(app).to.be.an.instanceof(Application);
    });
  });
});
