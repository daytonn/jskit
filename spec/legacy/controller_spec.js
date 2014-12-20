require("./spec_helper");
var Controller = require("../../lib/legacy/controller");

describe("Controller", function() {
  var subject;
  beforeEach(function() {
    subject = new Controller;
  });

  it("exists", function() {
    expect(subject).to.be.an.instanceof(Controller);
  });

  it("has a default initialize method", function() {
    expect(subject.initialize).to.be.a("function");
  });

  it("has a default actions array", function() {
    expect(subject.actions).to.be.an("array");
  });
});
