/* jshint esnext: true */
import { expect, spyOn, stub } from "./spec_helper";
import Controller from "../lib/controller";
import Events from "backbone-events-standalone";
import _ from "lodash";

describe("Controller", function() {
  var Dispatcher;
  var indexCalled;
  var subject;

  class TestController extends Controller {}

  beforeEach(function() {
    _.extend(TestController.prototype, {
        name: "test",
        actions: ["index"],
        index: function() {
          indexCalled = true;
        }
    });
    indexCalled = false;
    Dispatcher = Events;
    subject = new TestController(Dispatcher);
  });

  it("has an actions array", function() {
    expect(subject.actions).to.be.an("Array");
  });

  it("has a default channel", function() {
    expect(subject.channel).to.equal("controller");
  });

  it("has a default initialize method", function() {
    expect(subject.initialize).to.be.a("Function");
  });

  it("defers actions when subclassing", function() {
    subject = new TestController(Dispatcher);
    expect(subject.actions).to.contain("index");
  });

  it("registers action methods on the Dispatcher", function() {
    Dispatcher.trigger([subject.channel, subject.name, "index"].join(":"));
    expect(indexCalled).to.equal(true);
  });

  it("has a controllerName", function() {
    expect(subject.controllerName).to.equal("TestController");
  });

  describe("initialize", function() {
    it("calls initialize when the controller is constructed", function() {
      var initializeCalled = false;
      _.extend(TestController.prototype, {
        initialize: function() {
          initializeCalled = true;
        }
      });
      new TestController;
      expect(initializeCalled).to.equal(true);
    });
  });

  describe("with missing action methods", () => {
    beforeEach(function() {
      _.extend(TestController.prototype, { index: undefined });
    });

    it("throws an error when an action is missing it's method", () => {
      expect(() => {
        new TestController;
      }).to.throw('TestController action "index:index" method is undefined');
    });
  });

  describe("with namespace", () => {
    beforeEach(function() {
      _.extend(TestController.prototype, { namespace: "admin" });
    });

    it("wires up the actions with the namespace", () => {
      subject = new TestController(Dispatcher);
      Dispatcher.trigger([subject.namespace, subject.channel, subject.name, "index"].join(":"));
      expect(indexCalled).to.equal(true);
    });
  });

  describe("CamelCase controllers", () => {
    beforeEach(function() {
      _.extend(TestController.prototype, { name: "CamelCase", namespace: null });
      subject = new TestController;
    });

    it("lowercases the controller name with underscores", () => {
      Dispatcher.trigger("controller:camel_case:index");
      expect(indexCalled).to.equal(true);
    });
  });

  describe("with object action map", () => {
    var barCalled;

    beforeEach(() => {
      barCalled = false;
      _.extend(TestController.prototype, {
        actions: ["index", { foo: "bar" }],
        index: function() { indexCalled = true; },
        bar: function() { barCalled = true; }
      });
      subject = new TestController(Dispatcher);
    });

    it("wires up mapped actions", function() {
      Dispatcher.trigger("controller:test:foo");
      expect(barCalled).to.equal(true);
    });

    it("wires up normal actions", function() {
      Dispatcher.trigger("controller:test:index");
      expect(indexCalled).to.equal(true);
    });
  });
});
