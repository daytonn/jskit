describe("Controller", function() {
  var dispatcher;
  var subject;
  var testControllerDefaults = {
    name: "Test",
    actions: ["index", { mapped: "action" }],
    index: sinon.spy(),
    action: sinon.spy(),
    all: sinon.spy()
  };

  function controllerAttributes(attributes) {
    return _.extend({}, testControllerDefaults, attributes);
  }

  beforeEach(function() {
    dispatcher = new JSKit.Dispatcher;
    subject = createController(dispatcher, testControllerDefaults);
  });

  it("requires a dispatcher", function() {
    expect(function() {
      createController();
    }).to.throw(/dispatcher is undefined/);
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
    expect(subject.index).to.have.been.called;
  });

  it("has a className", function() {
    expect(subject.className).to.equal("TestController");
  });

  it("has an index action", function() {
    dispatcher.trigger(subject.actionEventName("index"));
    expect(subject.index).to.have.been.called;
  });

  it("has a mapped action", function() {
    dispatcher.trigger(subject.actionEventName("mapped"));
    expect(subject.action).to.have.been.called;
  });

  it("has an eventSeparator", function() {
    expect(subject.eventSeparator).to.equal(":");
  });

  it("has a default all function", function() {
    expect(subject.all).to.be.a("Function");
  });

  describe("all event", function() {
    it("automatically wires the all event", function() {
      dispatcher.trigger(subject.actionEventName("all"));
      expect(subject.all).to.have.been.called;
    });
  });

  describe("actionEventName", function() {
    it("returns the full event string for a given action", function() {
      var expectedEventName = _.compact([
        subject.namespace,
        subject.channel,
        subject.controllerEventName,
        "foo"
      ]).join(subject.eventSeparator);

      expect(subject.actionEventName("foo")).to.equal(expectedEventName);
    });
  });

  describe("default names", function() {
    beforeEach(function() {
      subject = new JSKit.Controller(dispatcher);
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

  describe("with missing action methods", function() {
    it("throws an error when an action is missing it's method", function() {
      expect(function() {
        createController(dispatcher, controllerAttributes({ index: undefined }));
      }).to.throw("TestController action \"index:index\" method is undefined");
    });
  });

  describe("with namespace", function() {
    beforeEach(function() {
      subject = createController(dispatcher, controllerAttributes({ namespace: "admin" }));
    });

    it("has a namespace", function() {
      expect(subject.namespace).to.equal("admin");
    });

    it("wires up the actions with the namespace", function() {
      dispatcher.trigger(subject.actionEventName("index"));
      expect(subject.index).to.have.been.called;
    });
  });

  describe("with channel", function() {
    beforeEach(function() {
      subject = createController(dispatcher, controllerAttributes({ channel: "custom" }));
    });

    it("has a channel", function() {
      expect(subject.channel).to.equal("custom");
    });

    it("wires up the actions with the channel", function() {
      dispatcher.trigger(subject.actionEventName("index"));
      expect(subject.index).to.have.been.called;
    });
  });

  describe("with eventSeparator", function() {
    beforeEach(function() {
      subject = createController(dispatcher, controllerAttributes({ eventSeparator: "." }));
    });

    it("wires up the actions with the eventSeparator", function() {
      dispatcher.trigger(subject.actionEventName("index"));
      expect(subject.index).to.have.been.called;
    });
  });

  describe("CamelCase controllers", function() {
    beforeEach(function() {
      subject = createController(dispatcher, controllerAttributes({ name: "CamelCase", namespace: null }));
    });

    it("lowercases the controller name with underscores", function() {
      dispatcher.trigger(subject.actionEventName("index"));
      expect(subject.index).to.have.been.called;
    });
  });

  describe("with object action map", function() {
    beforeEach(function() {
      subject = createController(dispatcher, {
        actions: ["index", { foo: "bar" }],
        index: sinon.spy(),
        bar: sinon.spy()
      });
    });

    it("wires up mapped actions", function() {
      dispatcher.trigger(subject.actionEventName("foo"));
      expect(subject.bar).to.have.been.called;
    });

    it("wires up normal actions", function() {
      dispatcher.trigger(subject.actionEventName("index"));
      expect(subject.index).to.have.been.called;
    });
  });
});
