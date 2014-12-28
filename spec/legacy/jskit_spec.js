require("./spec_helper");
require("../../lib/legacy/jskit");
var Application = require("../../lib/legacy/application");

describe("JSKit", function() {
  var subject;
  beforeEach(function() {
    subject = JSKit;
  });

  it("has a TestDispatcher class", function() {
    var dispatcher = new subject.TestDispatcher;
    expect(dispatcher.events).to.be.an("Object");
    expect(dispatcher.on).to.be.a("Function");
    expect(dispatcher.off).to.be.a("Function");
    expect(dispatcher.trigger).to.be.a("Function");
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
