/* jshint esnext: true */
import { expect, createController, createControllerWithMixins } from "./spec_helper";
import Controller from "../lib/controller";
import TestDispatcher from "../lib/test_dispatcher";
import _ from "lodash";

describe("Controller", function() {
  var dispatcher;
  var subject;
  var allCalled;
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

  it("requires a dispatcher", function() {
    expect(() => createController()).to.throw();
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

  it("has a className", () => {
    expect(subject.className).to.equal("TestController");
  });

  it("has an index action", () => {
    expect(dispatcher.hasAction(subject, "index")).to.equal(true);
  });

  it("has a mapped action", () => {
    expect(dispatcher.hasAction(subject, { mapped: "action" })).to.equal(true);
  });

  it("has an eventSeperator", () => {
    expect(subject.eventSeperator).to.equal(":");
  });

  it("has a default all function", () => {
    expect(subject.all).to.be.a("Function");
  });

  describe("Mixins", () => {
    var MixinOne;
    var MixinTwo;
    beforeEach(() => {
      MixinOne = {
        actions: ["mixinOne"],
        mixinOne: function() {},
        mOne: "test"
      };
      MixinTwo = {
        actions: ["mixinTwo"],
        mixinTwo: function() {},
        mTwo: "test"
      };
      subject = createControllerWithMixins(dispatcher, controllerDefaults, MixinOne, MixinTwo);
    });

    it("mixes in each mixin's actions", () => {
      expect(subject).to.have.action("mixinOne");
      expect(subject).to.have.action("mixinTwo");
    });

    it("mixes in each mixin's properties", () => {
      expect(subject.mOne).to.equal("test");
      expect(subject.mTwo).to.equal("test");
    });

  });

  describe("all event", () => {
    it("automatically wires the all event", () => {
      dispatcher.trigger(subject.actionEventName("all"));
      expect(subject.all.called).to.equal(true);
    });
  });

  describe("actionEventName", () => {
    it("returns the full event string for a given action", () => {
      var expectedEventName = _.compact([
        subject.namespace,
        subject.channel,
        subject.controllerEventName,
        "foo"
      ]).join(subject.eventSeperator);

      expect(subject.actionEventName("foo")).to.equal(expectedEventName);
    });
  });

  describe("default names", () => {
    beforeEach(function() {
      subject = new Controller(dispatcher);
    });

    it("has a default name of Anonymous", () => {
      expect(subject.name).to.equal("Anonymous");
    });

    it("has a default className of AnonymousController", () => {
      expect(subject.className).to.equal("AnonymousController");
    });
  });

  describe("initialize", () => {
    it("calls initialize when the controller is constructed", () => {
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
    beforeEach(() => {
      subject = createController(dispatcher, controllerAttributes({ namespace: "admin" }));
    });

    it("has a namespace", () => {
      expect(subject.namespace).to.equal("admin");
    });

    it("wires up the actions with the namespace", () => {
      dispatcher.trigger(subject.actionEventName("index"));
      expect(subject.index.called).to.equal(true);
    });
  });

  describe("with channel", () => {
    beforeEach(() => {
      subject = createController(dispatcher, controllerAttributes({ channel: "custom" }));
    });

    it("has a channel", () => {
      expect(subject.channel).to.equal("custom");
    });

    it("wires up the actions with the channel", () => {
      dispatcher.trigger(subject.actionEventName("index"));
      expect(subject.index.called).to.equal(true);
    });
  });

  describe("with eventSeperator", () => {
    beforeEach(() => {
      subject = createController(dispatcher, controllerAttributes({ eventSeperator: "." }));
    });

    it("wires up the actions with the eventSeperator", () => {
      dispatcher.trigger(subject.actionEventName("index"));
      expect(subject.index.called).to.equal(true);
    });
  });

  describe("CamelCase controllers", () => {
    beforeEach(() => {
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

    it("wires up mapped actions", () => {
      dispatcher.trigger(subject.actionEventName("foo"));
      expect(subject.bar.called).to.equal(true);
    });

    it("wires up normal actions", () => {
      dispatcher.trigger(subject.actionEventName("index"));
      expect(subject.index.called).to.equal(true);
    });
  });
});
