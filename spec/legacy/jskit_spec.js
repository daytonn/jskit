require("./spec_helper");
require("../../lib/legacy/jskit");
var Application = require("../../lib/legacy/application");

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
