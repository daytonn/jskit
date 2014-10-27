/* jshint esnext: true */
import { expect, createController } from "./spec_helper";
import Controller from "../lib/controller";
import TestDispatcher from "../lib/test_dispatcher";
import _ from "lodash";


describe("Controller", function() {
  var dispatcher;
  var subject;
  var controllerDefaults = {
    name: "Test",
    actions: ["index", { mapped: "action" }],
    index: function() {},
    action: function() {}
  };

  function controllerAttributes(attributes) {
    return _.extend({}, controllerDefaults, attributes);
  }

  class TestController extends Controller {}

  beforeEach(function() {
    dispatcher = new TestDispatcher;
    subject = createController(dispatcher, controllerDefaults);
  });

  it("has an actions array", function() {
    expect(subject.actions).to.be.an("Array");
  });

  it("has a dispatcher", function() {
    expect(subject.dispatcher).to.equal(dispatcher);
  });

  it("has a default channel", function() {
    expect(subject.channel).to.equal("controller");
  });

  it("has a default controllerEventName", function() {
    expect(subject.controllerEventName).to.equal("test");
  });

  it("has a default initialize method", function() {
    expect(subject.initialize).to.be.a("Function");
  });

  it("defers actions when subclassing", function() {
    expect(subject.actions).to.contain("index");
  });

  it("registers action methods on the dispatcher", function() {
    dispatcher.trigger(subject.actionEventName("index"));
    expect(subject.index.called).to.equal(true);
  });

  it("has a className", function() {
    expect(subject.className).to.equal("TestController");
  });

  it("has an index action", function() {
    expect(dispatcher.hasAction(subject, "index")).to.equal(true);
  });

  it("has a mapped action", function() {
    expect(dispatcher.hasAction(subject, { mapped: "action" })).to.equal(true);
  });

  it("has an eventSeperator", function() {
    expect(subject.eventSeperator).to.equal(":");
  });

  it("requires a dispatcher", function() {
    expect(() => createController()).to.throw();
  });

  describe("actionEventName", function() {
    it("returns the full event string for a given action", function() {
      var expectedEventName = _.compact([
        subject.namespace,
        subject.channel,
        subject.controllerEventName,
        "foo"
      ]).join(subject.eventSeperator);

      expect(subject.actionEventName("foo")).to.equal(expectedEventName);
    });
  });

  describe("default names", function() {
    beforeEach(function() {
      subject = new Controller(dispatcher);
    });

    it("has a default name of Anonymous", function() {
      expect(subject.name).to.equal("Anonymous");
    });

    it("has a default className of AnonymousController", function() {
      expect(subject.className).to.equal("AnonymousController");
    });
  });

  describe("initialize", function() {
    it("calls initialize when the controller is constructed", function() {
      var initializeCalled = false;
      createController(dispatcher, {
        initialize: function() {
          initializeCalled = true;
        }
      });
      expect(initializeCalled).to.equal(true);
    });
  });

  describe("with missing action methods", () => {
    it("throws an error when an action is missing it's method", () => {
      expect(() => {
        createController(dispatcher, controllerAttributes({ index: undefined }));
      }).to.throw(`TestController action "index:index" method is undefined`);
    });
  });

  describe("with namespace", () => {
    beforeEach(function() {
      subject = createController(dispatcher, controllerAttributes({ namespace: "admin" }));
    });

    it("has a namespace", function() {
      expect(subject.namespace).to.equal("admin");
    });

    it("wires up the actions with the namespace", () => {
      dispatcher.trigger(subject.actionEventName("index"));
      expect(subject.index.called).to.equal(true);
    });
  });

  describe("with channel", () => {
    beforeEach(function() {
      subject = createController(dispatcher, controllerAttributes({ channel: "custom" }));
    });

    it("has a channel", function() {
      expect(subject.channel).to.equal("custom");
    });

    it("wires up the actions with the channel", () => {
      dispatcher.trigger(subject.actionEventName("index"));
      expect(subject.index.called).to.equal(true);
    });
  });

  describe("with eventSeperator", () => {
    beforeEach(function() {
      subject = createController(dispatcher, controllerAttributes({ eventSeperator: "." }));
    });

    it("wires up the actions with the eventSeperator", () => {
      dispatcher.trigger(subject.actionEventName("index"));
      expect(subject.index.called).to.equal(true);
    });
  });

  describe("CamelCase controllers", () => {
    beforeEach(function() {
      subject = createController(dispatcher, controllerAttributes({ name: "CamelCase", namespace: null }));
    });

    it("lowercases the controller name with underscores", () => {
      dispatcher.trigger(subject.actionEventName("index"));
      expect(subject.index.called).to.equal(true);
    });
  });

  describe("with object action map", () => {
    beforeEach(() => {
      subject = createController(dispatcher, {
        actions: ["index", { foo: "bar" }],
        index: function() {},
        bar: function() {}
      });
    });

    it("wires up mapped actions", function() {
      dispatcher.trigger(subject.actionEventName("foo"));
      expect(subject.bar.called).to.equal(true);
    });

    it("wires up normal actions", function() {
      dispatcher.trigger(subject.actionEventName("index"));
      expect(subject.index.called).to.equal(true);
    });
  });
});
