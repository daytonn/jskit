describe("Dispatcher", function() {
  var subject;
  var handler;
  var foreignContext;
  var first = _.first;

  beforeEach(function() {
    foreignContext = {
      value: "foreign",
      handler: function() {
        this.value = "changed";
      }
    };
    handler = sinon.spy();
    subject = JSkit.Dispatcher.create();
  });

  describe("on", function() {
    beforeEach(function() {
      subject.on("some-event", handler);
    });

    it("registers a handler for an event", function() {
      var eventHandler = _.first(subject.__events__["some-event"]).handler;
      expect(eventHandler).to.equal(handler);
    });

    it("does not double register a handler", function() {
      subject.on("some-event", handler);
      expect(subject.__events__["some-event"].length).to.equal(1);
    });
  });

  describe("before", function() {
    var beforeHandler;

    beforeEach(function() {
      beforeHandler = sinon.spy();
      subject.on("some-event", handler);
      subject.before("some-event", beforeHandler);
    });

    it("prepends the handler to the events", function() {
      expect(first(subject.__events__["some-event"]).handler).to.equal(beforeHandler);
    });
  });

  describe("off", function() {
    beforeEach(function() {
      subject.on("some-event", handler);
    });

    it("removes all handlers from an event if only the event name is passed", function() {
      subject.off("some-event");
      expect(subject.__events__["some-event"].length).to.equal(0);
    });

    it("removes an event handler if the hander is passed", function() {
      subject.on("some-event", foreignContext.handler);
      subject.off("some-event", handler);
      expect(subject.__events__["some-event"].length).to.equal(1);
    });
  });

  describe("trigger", function() {
    beforeEach(function() {
      subject.on("some-event", handler);
      subject.trigger("some-event", "one", "two");
      subject.on("boundHandler", foreignContext.handler, foreignContext);
      subject.trigger("boundHandler");
    });

    it("triggers events", function() {
      expect(handler.called).to.be.true;
    });

    it("deduplicates the handlers", function() {
      expect(handler.callCount).to.equal(1);
    });

    it("binds a context to the event handler", function() {
      expect(foreignContext.value).to.equal("changed");
    });

    it("passes the tail of the arguments array to the handler", function() {
      expect(handler.calledWith("one", "two")).to.be.true;
    });
  });
});
