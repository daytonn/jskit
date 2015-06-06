import Controller from "../src/controller";
import Dispatcher from "../src/dispatcher";

describe("Controller", () => {
  let extend = _.extend;
  let last = _.last;
  let first = _.first;
  let dispatcher;
  let subject;
  let testControllerDefaults;
  let indexCalled;
  let allCalled;
  let actionCalled;
  let $fixtures;

  beforeEach(() => {
    $fixtures = $("#fixtures");
    dispatcher = new Dispatcher;
    testControllerDefaults = {
      action() { actionCalled = true; },
      actions: ["index", { mapped: "action" }],
      all() { allCalled = true; },
      dispatcher: dispatcher,
      index() { indexCalled = true; },
      name: "Test"
    };
    subject = Controller.create(testControllerDefaults);
  });

  describe("defaults", () => {
    beforeEach(() => {
      subject = Controller.create({ name: "Test" });
    });

    it("requires a name", function() {
      expect(() => {
        Controller.create();
      }).to.throw(/name is undefined/);
    });

    it("has a default dispatcher", () => {
      expect(subject.dispatcher).to.be.an.instanceof(Dispatcher);
    });

    it("has an actions array", () => {
      expect(subject.actions).to.be.an("Array");
    });

    it("has a default channel", () => {
      expect(subject.channel).to.equal("controller");
    });

    it("has a default initialize method", () => {
      expect(subject.initialize).to.be.a("Function");
    });

    it("has a default controllerEventName", () => {
      expect(subject.controllerEventName).to.equal("test");
    });

    it("has an eventSeparator", () => {
      expect(subject.eventSeparator).to.equal(":");
    });

    it("has an all function", () => {
      expect(subject.all).to.be.a("Function");
    });

    it("has an elements object", () => {
      expect(subject.elements).to.be.an("Object");
    });

    it("has an events object", () => {
      expect(subject.events).to.be.an("Object");
    });
  });

  describe("options", () => {
    it("has an index action", () => {
      expect(subject.actions).to.contain("index");
    });

    it("has a mapped action", () => {
      expect(last(subject.actions).mapped).to.equal("action");
    });
  });

  describe("actions", () => {
    it("registers action methods on the dispatcher", () => {
      subject.dispatcher.trigger("controller:test:index");
      expect(indexCalled).to.equal(true);
    });

    it("automatically wires the all event", () => {
      dispatcher.trigger("controller:test:all");
      expect(allCalled).to.equal(true);
    });
  });

  describe("initialize", () => {
    let initializeCalled;

    beforeEach(() => {
      subject = Controller.create(extend(testControllerDefaults, {
        initialize() { initializeCalled = true; }
      }));
    });

    it("calls initialize when the controller is constructed", () => {
      expect(initializeCalled).to.equal(true);
    });
  });

  describe("with missing action methods", () => {
    it("throws an error when an action is missing it's method", () => {
      expect(() => {
        let attrs = extend({}, testControllerDefaults, { index: undefined });
        Controller.create(attrs);
      }).to.throw("Test action \"index:index\" method is undefined");
    });
  });

  describe("with namespace", () => {
    beforeEach(() => {
      let attrs = extend({}, testControllerDefaults, { namespace: "admin" });
      subject = Controller.create(attrs);
    });

    it("has a namespace", () => {
      expect(subject.namespace).to.equal("admin");
    });

    it("wires up the actions with the namespace", () => {
      subject.dispatcher.trigger("admin:controller:test:index");
      expect(indexCalled).to.equal(true);
    });
  });

  describe("with channel", () => {
    beforeEach(() => {
      let attrs = extend({}, testControllerDefaults, { channel: "custom" });
      subject = Controller.create(attrs);
    });

    it("has a channel", () => {
      expect(subject.channel).to.equal("custom");
    });

    it("wires up the actions with the channel", () => {
      dispatcher.trigger("custom:test:index");
      expect(indexCalled).to.equal(true);
    });
  });

  describe("with eventSeparator", () => {
    beforeEach(() => {
      let attrs = extend({}, testControllerDefaults, { eventSeparator: "." });
      subject = Controller.create(attrs);
    });

    it("wires up the actions with the eventSeparator", () => {
      subject.dispatcher.trigger("controller.test.index");
      expect(indexCalled).to.equal(true);
    });
  });

  describe("CamelCase controllers", () => {
    beforeEach(() => {
      let attrs = extend({}, testControllerDefaults, { name: "CamelCase" });
      subject = Controller.create(attrs);
    });

    it("lowercases the controller name with underscores", () => {
      subject.dispatcher.trigger("controller:camel_case:index");
      expect(indexCalled).to.equal(true);
    });
  });

  describe("with object action map", () => {
    let barCalled;

    beforeEach(() => {
      let attrs = extend({}, testControllerDefaults, {
        actions: ["index", { foo: "bar" }],
        bar() { barCalled = true; }
      });
      subject = Controller.create(attrs);
    });

    it("wires up mapped actions", () => {
      subject.dispatcher.trigger("controller:test:foo");
      expect(barCalled).to.equal(true);
    });

    it("wires up normal actions", () => {
      subject.dispatcher.trigger("controller:test:index");
      expect(indexCalled).to.equal(true);
    });
  });

  describe("elements", () => {
    beforeEach(() => {
      $fixtures.append("<a id='element' href='#'>Test</a>");
      subject = Controller.create(extend({}, testControllerDefaults, {
        elements: {
          index: { element: "#element" }
        }
      }));
    });

    it("registers cacheElements before actions", () => {
      let cacheElements = first(subject.dispatcher.__events__["controller:test:index"]).handler;
      cacheElements();
      expect(subject.$element).to.exist;
    });
  });

  describe("events", () => {
    let handleElementClickCalled;

    beforeEach(() => {
      $fixtures.append("<a id='element' href='#'>Test</a>");
      subject = Controller.create(extend({}, testControllerDefaults, {
        handleElementClick: function() { handleElementClickCalled = true; },
        elements: {
          index: { element: "#element" }
        },
        events: {
          index: {
            element: { click: "handleElementClick" }
          }
        }
      }));
    });

    // This test passes in the browser but not on cli
    xit("wires up events", () => {
      subject.dispatcher.trigger("controller:test:index");
      subject.$element.trigger("click");
      expect(handleElementClickCalled).to.equal(true);
    });
  });
});
