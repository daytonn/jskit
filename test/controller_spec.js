describe("Controller", function() {
  var extend = _.extend;
  var last = _.last;
  var first = _.first;
  var each = _.each;
  var dispatcher;
  var subject;
  var testControllerDefaults;
  var indexCalled;
  var allCalled;
  var actionCalled;
  var anotherActionCalled;
  var $fixtures;

  beforeEach(function() {
    $fixtures = $("#fixtures");
    dispatcher = JSkit.Dispatcher.create();
    testControllerDefaults = {
      name: "Test",
      actions: ["index", { mapped: "action", another: "anotherAction" }],
      dispatcher: dispatcher,
      all: function() { allCalled = true; },
      index: function() { indexCalled = true; },
      action: function() { actionCalled = true; },
      anotherAction: function() { anotherActionCalled = true; }
    };
    subject = JSkit.Controller.create(extend({}, testControllerDefaults));
  });

  describe("defaults", function() {
    beforeEach(function() {
      subject = JSkit.Controller.create({ name: "Test" });
    });

    it("requires a name", function() {
      expect(function() {
        JSkit.Controller.create();
      }).to.throw(/name is undefined/);
    });

    it("has a default dispatcher", function() {
      expect(subject.dispatcher).to.be.an("Object");
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

    it("has a default controllerEventName", function() {
      expect(subject.controllerEventName).to.equal("test");
    });

    it("has an eventSeparator", function() {
      expect(subject.eventSeparator).to.equal(":");
    });

    it("has an all function", function() {
      expect(subject.all).to.be.a("Function");
    });

    it("has an elements object", function() {
      expect(subject.elements).to.be.an("Object");
    });
  });

  describe("options", function() {
    it("has an index action", function() {
      expect(subject).to.have.action("index");
    });

    it("has a mapped action", function() {
      expect(subject).to.have.action("mapped", "action");
    });

    it("restricts keywords", function() {
      expect(function() {
        JSkit.Controller.create(extend({}, testControllerDefaults, {
          name: "Test",
          registerEvents: "invalid"
        }));
      }).to.throw("JSkit.Controller.create: registerEvents is a restricted keyword");

      expect(function() {
        JSkit.Controller.create(extend({}, testControllerDefaults, {
          name: "Test",
          registerActions: "invalid"
        }));
      }).to.throw("JSkit.Controller.create: registerActions is a restricted keyword");

      expect(function() {
        JSkit.Controller.create(extend({}, testControllerDefaults, {
          name: "Test",
          cacheElements: "invalid"
        }));
      }).to.throw("JSkit.Controller.create: cacheElements is a restricted keyword");

      expect(function() {
        JSkit.Controller.create(extend({}, testControllerDefaults, {
          name: "Test",
          actionEventName: "invalid"
        }));
      }).to.throw("JSkit.Controller.create: actionEventName is a restricted keyword");
    });
  });

  describe("actions", function() {
    it("normalizes the actions", function() {
      expect(subject.__actions__).to.be.like([
        { name: "all", method: "all" },
        { name: "index", method: "index" },
        { name: "mapped", method: "action" },
        { name: "another", method: "anotherAction" }
      ]);
    });

    it("registers action methods on the dispatcher", function() {
      subject.dispatcher.trigger("controller:test:index");
      expect(indexCalled).to.be.true;

    });

    it("automatically wires the all event", function() {
      dispatcher.trigger("controller:test:all");
      expect(allCalled).to.equal(true);
    });

    it("wires up mapped actions", function() {
      dispatcher.trigger("controller:test:mapped");
      expect(actionCalled).to.equal(true);
    });

    it("wires up mapped actions with multiple maps", function() {
      dispatcher.trigger("controller:test:another");
      expect(anotherActionCalled).to.equal(true);
    });
  });

  describe("actionEventName", function() {
    it("returns the event string for a given action", function() {
      expect(subject.actionEventName("index")).to.equal("controller:test:index");
    });
  });

  describe("initialize", function() {
    var initializeCalled;

    beforeEach(function() {
      subject = JSkit.Controller.create(extend(testControllerDefaults, {
        initialize: function() { initializeCalled = true; }
      }));
    });

    it("calls initialize when the controller is constructed", function() {
      expect(initializeCalled).to.equal(true);
    });

    describe("elementCacheing registration", function() {
      var subject;
      beforeEach(function() {
        $fixtures.append("<a id='element' href='#'>Test</a>");
      });

      it("caches the elements for a given action", function() {
        subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
          elements: { index: { element: "#element" }}
        }));
        subject.dispatcher.trigger("controller:test:index");
        expect(subject.$element).to.have.$attr("id", "element");
      });

      it("caches the elements for a mapped action", function() {
        subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
          elements: { mapped: { element: "#element" }}
        }));
        subject.dispatcher.trigger("controller:test:mapped");
        expect(subject.$element).to.have.$attr("id", "element");
      });

      it("caches the elements for all actions", function() {
        subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
          elements: { all: { element: "#element"} }
        }));

        subject.dispatcher.trigger("controller:test:all");
        expect(subject.$element).to.have.$attr("id", "element");
      });
    });
  });

  describe("with missing action methods", function() {
    it("throws an error when an action is missing it's method", function() {
      expect(function() {
        var attrs = extend({}, testControllerDefaults, { index: undefined });
        JSkit.Controller.create(attrs);
      }).to.throw("Test action \"index:index\" method is undefined");
    });
  });

  describe("with namespace", function() {
    beforeEach(function() {
      var attrs = extend({}, testControllerDefaults, { namespace: "admin" });
      subject = JSkit.Controller.create(attrs);
    });

    it("has a namespace", function() {
      expect(subject.namespace).to.equal("admin");
    });

    it("wires up the actions with the namespace", function() {
      subject.dispatcher.trigger("admin:controller:test:index");
      expect(indexCalled).to.equal(true);
    });
  });

  describe("with channel", function() {
    beforeEach(function() {
      var attrs = extend({}, testControllerDefaults, { channel: "custom" });
      subject = JSkit.Controller.create(attrs);
    });

    it("has a channel", function() {
      expect(subject.channel).to.equal("custom");
    });

    it("wires up the actions with the channel", function() {
      dispatcher.trigger("custom:test:index");
      expect(indexCalled).to.equal(true);
    });
  });

  describe("with eventSeparator", function() {
    beforeEach(function() {
      var attrs = extend({}, testControllerDefaults, { eventSeparator: "." });
      subject = JSkit.Controller.create(attrs);
    });

    it("wires up the actions with the eventSeparator", function() {
      subject.dispatcher.trigger("controller.test.index");
      expect(indexCalled).to.equal(true);
    });
  });

  describe("CamelCase controllers", function() {
    beforeEach(function() {
      var attrs = extend({}, testControllerDefaults, { name: "CamelCase" });
      subject = JSkit.Controller.create(attrs);
    });

    it("lowercases the controller name with underscores", function() {
      subject.dispatcher.trigger("controller:camel_case:index");
      expect(indexCalled).to.equal(true);
    });
  });

  describe("with object action map", function() {
    var barCalled;

    beforeEach(function() {
      var attrs = extend({}, testControllerDefaults, {
        actions: ["index", { foo: "bar" }],
        bar: function() { barCalled = true; }
      });
      subject = JSkit.Controller.create(attrs);
    });

    it("wires up mapped actions", function() {
      subject.dispatcher.trigger("controller:test:foo");
      expect(barCalled).to.equal(true);
    });

    it("wires up normal actions", function() {
      subject.dispatcher.trigger("controller:test:index");
      expect(indexCalled).to.equal(true);
    });
  });

  describe("elements", function() {
    beforeEach(function() {
      $fixtures.append("<a id='element' href='#'>Test</a>");
      subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
        elements: {
          index: { element: "#element" }
        }
      }));
    });

    it("creates a normalized list of elements", function() {
      expect(subject.__elements__).to.be.like({
        index: { element: "#element" }
      });
    });

    describe("with events", function() {
      beforeEach(function() {
        subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
          elements: {
            index: { element: ["#element", { click: "handleClick" }] }
          }
        }));
      });

      it("creates a normalized list of elements", function() {
        expect(subject.__elements__).to.be.like({
          index: { element: "#element" }
        });
      });

      it("creates a normalized list of events", function() {
        expect(subject.__events__).to.be.like({
          index: {
            $element: { click: "handleClick" }
          }
        });
      });
    });
  });

  describe("cacheElements", function() {
    var subject;
    beforeEach(function() {
      $fixtures.append("<a id='element' href='#'>Test</a>");
    });

    it("caches the elements for a given action", function() {
      subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
        elements: { index: { element: "#element" }}
      }));
      subject.cacheElements("index");
      expect(subject.$element).to.have.$attr("id", "element");
    });

    it("caches the elements for a mapped action", function() {
      subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
        elements: { mapped: { element: "#element" }}
      }));
      subject.cacheElements("mapped");
      expect(subject.$element).to.have.$attr("id", "element");
    });

    it("caches the elements for all actions", function() {
      subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
        elements: { all: { element: "#element"} }
      }));
      subject.cacheElements("all");
      expect(subject.$element).to.have.$attr("id", "element");
    });

    it("throws an error if called with no action", function() {
      expect(function() {
        subject.cacheElements();
      }).to.throw("JSkit.Controller.cacheElements: action is undefined");
    });

    it("throws an error if the element is not in the DOM", function() {
      subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
        elements: {
          index: { element: "#non-existent" }
        }
      }));

      expect(function() {
        subject.cacheElements("index");
      }).to.throw("JSkit.Controller.cacheElements: #non-existent is not in the DOM");
    });

    describe("without jQuery", function() {
      var originalJQuery;
      var dollar;
      beforeEach(function() {
        originalJQuery = window.jQuery;
        dollar = window.$;
        window.jQuery = undefined;
        window.$ = undefined;
        subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
          elements: { index: { element: "#element" } }
        }));
      });

      afterEach(function() {
        window.jQuery = originalJQuery;
        window.$ = dollar;
      });

      it("falls back to querySelectorAll", function() {
        subject.cacheElements("index");
        expect(subject.$element.children).to.eq(document.querySelectorAll("#element").children);
      });
    });
  });


  describe("registerEvents", function() {
    var handleElementClickCalled;

    beforeEach(function() {
      $fixtures.append("<a id='element' href='#'>Test</a>");
      subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
        handleElementClick: function() { handleElementClickCalled = true; },
        elements: {
          mapped: { element: ["#element", { click: "handleElementClick" }]},
          index: { element: ["#element", { click: "handleElementClick" }] }
        }
      }));
    });

    it("caches the elements", function() {
      subject.registerEvents("index");
      expect(subject.$element).to.have.$attr("id", "element");
    });

    it("caches the elements for mapped action", function() {
      subject.registerEvents("mapped");
      expect(subject.$element).to.have.$attr("id", "element");
    });

    it("wires up events", function() {
      subject.registerEvents("index");
      subject.$element.trigger("click");
      expect(handleElementClickCalled).to.equal(true);
    });

    describe("multiple events", function() {
      var handleElementKeyupCalled;

      beforeEach(function() {
        subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
          handleElementClick: function() { handleElementClickCalled = true; },
          handleElementKeyup: function() { handleElementKeyupCalled = true; },

          elements: {
            index: { element: ["#element", { click: "handleElementClick", keyup: "handleElementKeyup" }] }
          }
        }));
      });

      it("wires up multiple events to the same element", function() {
        subject.registerEvents("index");

        subject.$element.trigger("click");
        expect(handleElementClickCalled).to.equal(true);

        subject.$element.trigger("keyup");
        expect(handleElementKeyupCalled).to.equal(true);
      });
    });

    describe("function event targets", function() {
      var handleElementClickCalled;

      beforeEach(function() {
        subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
          handleElementClick: function() { handleElementClickCalled = true; },
          elements: {
            index: {
              element: ["#element", function(on) {
                on("click", this.handleElementClick);
              }]
            }
          }
        }));
      });

      it("wires up the events prescribed by the function", function() {
        subject.registerEvents("index");
        subject.$element.trigger("click");
        expect(handleElementClickCalled).to.equal(true);
      });
    });
  });
});
