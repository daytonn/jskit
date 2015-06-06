import Controller from "../src/controller";
import Dispatcher from "../src/dispatcher";

describe("Controller", () => {
  let extend = _.extend;
  let dispatcher;
  let subject;
  let testControllerDefaults = {
    name: "Test",
    actions: ["index", { mapped: "action" }],
    index: sinon.spy(),
    action: sinon.spy(),
    all: sinon.spy()
  };


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
  });

  describe("options", () => {
    beforeEach(() => {
      subject = Controller.create(testControllerDefaults);
    });

    it("has an index action", () => {
      expect(subject.actions).to.contain("index");
    });

    xit("has a mapped action", () => {

    });
  });

  // it("registers action methods on the dispatcher", () => {
  //   dispatcher.trigger(subject.actionEventName("index"));
  //   expect(subject.index.called).to.be.true;
  // });

  // describe("all event", () => {
  //   it("automatically wires the all event", () => {
  //     dispatcher.trigger(subject.actionEventName("all"));
  //     expect(subject.all.called).to.be.true;
  //   });
  // });

  // describe("actionEventName", () => {
  //   it("returns the full event string for a given action", () => {
  //     var expectedEventName = _.compact([
  //       subject.namespace,
  //       subject.channel,
  //       subject.controllerEventName,
  //       "foo"
  //     ]).join(subject.eventSeparator);

  //     expect(subject.actionEventName("foo")).to.equal(expectedEventName);
  //   });
  // });

  // describe("default names", () => {
  //   beforeEach(() => {
  //     subject = new JSKit.Controller(dispatcher);
  //   });

  //   it("has a default name of Anonymous", () => {
  //     expect(subject.name).to.equal("Anonymous");
  //   });

  //   it("has a default className of AnonymousController", () => {
  //     expect(subject.className).to.equal("AnonymousController");
  //   });
  // });

  // describe("initialize", () => {
  //   it("calls initialize when the controller is constructed", () => {
  //     var initializeCalled = false;
  //     createController(dispatcher, {
  //       initialize: () => {
  //         initializeCalled = true;
  //       }
  //     });
  //     expect(initializeCalled).to.equal(true);
  //   });
  // });

  // describe("with missing action methods", () => {
  //   it("throws an error when an action is missing it's method", () => {
  //     expect(() => {
  //       createController(dispatcher, controllerAttributes({ index: undefined }));
  //     }).to.throw("TestController action \"index:index\" method is undefined");
  //   });
  // });

  // describe("with namespace", () => {
  //   beforeEach(() => {
  //     subject = createController(dispatcher, controllerAttributes({ namespace: "admin" }));
  //   });

  //   it("has a namespace", () => {
  //     expect(subject.namespace).to.equal("admin");
  //   });

  //   it("wires up the actions with the namespace", () => {
  //     dispatcher.trigger(subject.actionEventName("index"));
  //     expect(subject.index.called).to.be.true;
  //   });
  // });

  // describe("with channel", () => {
  //   beforeEach(() => {
  //     subject = createController(dispatcher, controllerAttributes({ channel: "custom" }));
  //   });

  //   it("has a channel", () => {
  //     expect(subject.channel).to.equal("custom");
  //   });

  //   it("wires up the actions with the channel", () => {
  //     dispatcher.trigger(subject.actionEventName("index"));
  //     expect(subject.index.called).to.be.true;
  //   });
  // });

  // describe("with eventSeparator", () => {
  //   beforeEach(() => {
  //     subject = createController(dispatcher, controllerAttributes({ eventSeparator: "." }));
  //   });

  //   it("wires up the actions with the eventSeparator", () => {
  //     dispatcher.trigger(subject.actionEventName("index"));
  //     expect(subject.index.called).to.be.true;
  //   });
  // });

  // describe("CamelCase controllers", () => {
  //   beforeEach(() => {
  //     subject = createController(dispatcher, controllerAttributes({ name: "CamelCase", namespace: null }));
  //   });

  //   it("lowercases the controller name with underscores", () => {
  //     dispatcher.trigger(subject.actionEventName("index"));
  //     expect(subject.index.called).to.be.true;
  //   });
  // });

  // describe("with object action map", () => {
  //   beforeEach(() => {
  //     subject = createController(dispatcher, {
  //       actions: ["index", { foo: "bar" }],
  //       index: sinon.spy(),
  //       bar: sinon.spy()
  //     });
  //   });

  //   it("wires up mapped actions", () => {
  //     dispatcher.trigger(subject.actionEventName("foo"));
  //     expect(subject.bar.called).to.be.true;
  //   });

  //   it("wires up normal actions", () => {
  //     dispatcher.trigger(subject.actionEventName("index"));
  //     expect(subject.index.called).to.be.true;
  //   });
  // });
});
