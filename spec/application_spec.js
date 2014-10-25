/* jshint esnext: true */
import { expect, spyOn, stub } from "./spec_helper";
import Application from "../lib/application";
import Controller from "../lib/controller";

describe("Application", () => {
  var subject;
  beforeEach(function() {
    subject = new Application;
  });

  it("has a Controllers namespace", () => {
    expect(subject.Controllers).to.be.an("object");
  });

  it("has a Dispatcher", () => {
    expect(subject.Dispatcher.on).to.be.a("function");
    expect(subject.Dispatcher.off).to.be.a("function");
    expect(subject.Dispatcher.trigger).to.be.a("function");
    expect(subject.Dispatcher.once).to.be.a("function");
    expect(subject.Dispatcher.listenTo).to.be.a("function");
    expect(subject.Dispatcher.stopListening).to.be.a("function");
    expect(subject.Dispatcher.listenToOnce).to.be.a("function");
  });

  describe("createController", () => {
    var controller;
    describe("regular controllers", () => {
      beforeEach(() => {
        controller = subject.createController("Test", {
          actions: ["index"],
          index: function() { this.indexCalled = true; }
        });
      });

      it("creates a controller instance on the Controler's namespace", () => {
        expect(subject.Controllers.Test).to.be.an.instanceof(Controller);
      });

      it("returns the controller", () => {
        expect(controller).to.be.an.instanceof(Controller);
      });

      it("extends the new controller's prototype with the attributes", () => {
        expect(controller.index).to.be.a("function");
      });

      it("wires up the actions to the dispatcher", () => {
        subject.Dispatcher.trigger("controller:test:index");
        expect(controller.indexCalled).to.equal(true);
      });

      it("saves a reference to the controller constructor", () => {
        expect(subject.TestController).to.be.defined;
      });

      it("copies the actions to the controller's constructor", function() {
        expect(controller.actions).to.contain("index");
      });

      describe("with missing action methods", () => {
        it("throws an error when an action is missing it's method", () => {
          expect(() => {
            subject.createController("Test", { actions: ["index"] });
          }).to.throw("'Test' Controller has an action 'index' defined with no corresponding method");
        });
      });

      describe("with namespace", () => {
        it("wires up the actions with the namespace", () => {
          controller = subject.createController("Test", {
            namespace: "admin",
            actions: ["index"],
            index: function() { this.indexCalled = true; }
          });
          subject.Dispatcher.trigger("admin:controller:test:index");
          expect(controller.indexCalled).to.equal(true);
        });
      });

      describe("with object action map", () => {
        beforeEach(() => {
          controller = subject.createController("Test", {
            actions: ["index", { foo: "bar" }],
            index: function() { this.indexCalled = true; },
            bar: function() { this.barCalled = true; }
          });
        });

        it("wires up mapped actions", function() {
          subject.Dispatcher.trigger("controller:test:foo");
          expect(controller.barCalled).to.equal(true);
        });

        it("wires up normal actions", function() {
          subject.Dispatcher.trigger("controller:test:index");
          expect(controller.indexCalled).to.equal(true);
        });
      });
    });

    describe("Application controller", () => {
      beforeEach(() => {
        controller = subject.createController("Application", {
          init: function() { this.initCalled = true }
        });
      });

      it("wires init to the controller:all event", () => {
        subject.Dispatcher.trigger("controller:all");
        expect(controller.initCalled).to.equal(true);
      });
    });

    describe("CamelCase controllers", () => {
      beforeEach(() => {
        controller = subject.createController("CamelCase", {
          actions: ["index"],

          index: function() { this.indexCalled = true }
        });
      });

      it("lowercases the controller name with underscores", () => {
        subject.Dispatcher.trigger("controller:camel_case:index");
        expect(controller.indexCalled).to.equal(true);
      });
    });
  });
});
