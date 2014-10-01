require("./spec_helper");
var Application = require("../lib/application");
var Controller = require("../lib/controller");

describe("Application", function() {
  var subject;
  beforeEach(function() {
    subject = new Application;
  });

  it("has a Controllers namespace", function() {
    expect(subject.Controllers).to.be.an("object");
  });

  it("has a Dispatcher", function() {
    expect(subject.Dispatcher.on).to.be.a("function");
    expect(subject.Dispatcher.off).to.be.a("function");
    expect(subject.Dispatcher.trigger).to.be.a("function");
    expect(subject.Dispatcher.once).to.be.a("function");
    expect(subject.Dispatcher.listenTo).to.be.a("function");
    expect(subject.Dispatcher.stopListening).to.be.a("function");
    expect(subject.Dispatcher.listenToOnce).to.be.a("function");
  });

  describe("createController", function() {
    var controller;
    describe("regular controllers", function() {
      beforeEach(function() {
        controller = subject.createController("Test", {
          actions: ["index"],
          index: function() { this.indexCalled = true; }
        });
      });

      it("creates a controller instance on the Controler's namespace", function() {
        expect(subject.Controllers.Test).to.be.an.instanceof(Controller);
      });

      it("returns the controller", function() {
        expect(controller).to.be.an.instanceof(Controller);
      });

      it("extends the new controller's prototype with the attributes", function() {
        expect(controller.index).to.be.a("function");
      });

      it("wires up the actions to the dispatcher", function() {
        subject.Dispatcher.trigger("controller:test:index");
        expect(controller.indexCalled).to.equal(true);
      });

      describe("with missing action methods", function() {
        it("throws an error when an action is missing it's method", function() {
          expect(function() {
            subject.createController("Test", { actions: ["index"] });
          }).to.throw("'Test' Controller has an action 'index' defined with no corresponding method");
        });
      });

      describe("with namespace", function() {
        it("wires up the actions with the namespace", function() {
          controller = subject.createController("Test", {
            namespace: "admin",
            actions: ["index"],
            index: function() { this.indexCalled = true; }
          });
          subject.Dispatcher.trigger("admin:controller:test:index");
          expect(controller.indexCalled).to.equal(true);
        });
      });
    });

    describe("application controller", function() {
      beforeEach(function() {
        controller = subject.createController("Application", {
          init: function() { this.initCalled = true }
        });
      });

      it("wires init to the controller:all event", function() {
        subject.Dispatcher.trigger("controller:all");
        expect(controller.initCalled).to.equal(true);
      });
    });
  });
});
