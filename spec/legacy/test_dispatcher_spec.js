require("./spec_helper");
var Controller = require("../../lib/legacy/controller");
var TestDispatcher = require("../../lib/legacy/test_dispatcher");
var Events = require("backbone-events-standalone");

var extend = _.extend;
var each = _.each;
var functions = _.functions;

describe("TestDispatcher", function() {
  var subject;
  var controller;
  function TestController() { Controller.apply(this, arguments); }

  beforeEach(function() {
    extend(TestController.prototype, Controller.prototype, {
      name: "Test",
      actions: ["foo", { bar: "foo" }],
      foo: function() { this.otherMethod(); },
      otherMethod: function() {}
    });
    subject = new TestDispatcher;
    controller = new TestController(subject);
  });

  it("has a shadowDispatcher", function() {
    expect(subject.shadowDispatcher.on).to.be.a("Function");
    expect(subject.shadowDispatcher.off).to.be.a("Function");
    expect(subject.shadowDispatcher.trigger).to.be.a("Function");
  });

  it("has an array of listeners", function() {
    expect(subject.listeners).to.be.an("Array");
  });

  describe("on", function() {
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

    it("saves a reference to the controller that registered to it", function() {
      expect(subject.listeners).to.contain(controller);
    });

    it("does not store duplicate instances of controllers", function() {
      expect(subject.listeners.length).to.eq(1);
    });

    it("adds a spy tooling to each controller method", function() {
      expect(controller.otherMethod.called).to.equal(false);
      expect(controller.otherMethod.callCount).to.equal(0);
      expect(controller.otherMethod.calls).to.be.an("Array");

      controller.otherMethod(1, 2, 3);

      expect(controller.otherMethod.called).to.equal(true);
      expect(controller.otherMethod.callCount).to.equal(1);

      var args = _.first(controller.otherMethod.calls).args;

      expect(args).to.contain(1);
      expect(args).to.contain(2);
      expect(args).to.contain(3);

      controller.foo();

      expect(controller.otherMethod.callCount).to.equal(2);

      expect(_.last(controller.otherMethod.calls).args.length).to.be.empty;
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

  describe("hasAction", function() {
    it("returns true when the controller has the given action", function() {
      expect(subject.hasAction(controller, "foo")).to.equal(true);
    });

    it("returns false when the controller does not have the given action", function() {
      expect(subject.hasAction(controller, "nonexistent")).to.equal(false);
    });

    it("works with mapped actions", function() {
      expect(subject.hasAction(controller, { bar: "foo" })).to.equal(true);
      expect(subject.hasAction(controller, { non: "existent" })).to.equal(false);
    });
  });
});
