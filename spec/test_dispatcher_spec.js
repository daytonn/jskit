/* jshint esnext: true */
import { expect } from "./spec_helper";
import Events from "backbone-events-standalone";
import TestDispatcher from "../lib/test_dispatcher";
import Controller from "../lib/controller";
import _ from "lodash";

describe("TestDispatcher", function() {
  var subject;
  var controller;
  class TestController extends Controller {}

  beforeEach(function() {
    _.extend(TestController.prototype, {
      name: "Test",
      actions: ["foo", { bar: "foo" }],
      foo: function() {}
    });
    subject = new TestDispatcher;
    controller = new TestController(subject);
  });

  it("has an events object", function() {
    expect(subject.events).to.be.an("Object");
  });

  it("has a shadowDispatcher", function() {
    expect(subject.shadowDispatcher.on).to.be.a("Function");
    expect(subject.shadowDispatcher.off).to.be.a("Function");
    expect(subject.shadowDispatcher.trigger).to.be.a("Function");
  });

  describe("on", function() {
    it("adds the event to the events object", function() {
      ["foo", "bar"].forEach((action) => {
        var eventName = controller.actionEventName(action);
        expect(subject.events[eventName]).to.contain(controller.foo);
      });
    });

    it("adds a spy tooling to the handler", function() {
      expect(controller.foo.called).to.equal(false);
      expect(controller.foo.callCount).to.equal(0);
      expect(controller.foo.calls).to.be.an("Array");
    });

    it("registers trackSpy to the shadow dispatcher events", function() {
      subject.shadowDispatcher.trigger(controller.actionEventName("foo"));

      expect(controller.foo.called).to.equal(true);
      expect(controller.foo.callCount).to.equal(1);
      expect(controller.foo.calls.length).to.equal(1);
    });
  });

  describe("trigger", function() {
    var eventFired;
    beforeEach(function() {
      eventFired = false;

      subject.shadowDispatcher.on("testEvent", function() {
        eventFired = true;
      });
    });

    it("triggers the shadowDispatcher", function() {
      subject.trigger("testEvent");
      expect(eventFired).to.equal(true);
    });
  });
});
