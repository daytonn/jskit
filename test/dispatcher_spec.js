import Dispatcher from '../src/dispatcher';

describe("Dispatcher", () => {
  let subject;
  let handler;
  let foreignContext;
  let first = _.first;

  beforeEach(() => {
    foreignContext = {
      value: "foreign",
      handler() {
        this.value = "changed";
      }
    };
    handler = sinon.spy();
    subject = Dispatcher.create();
  });

  describe("on", () => {
    beforeEach(() => {
      subject.on("some-event", handler);
    });

    it("registers a handler for an event", () => {
      var eventHandler = _.first(subject.__events__["some-event"]).handler;
      expect(eventHandler).to.equal(handler);
    });

    it("does not double register a handler", () => {
      subject.on("some-event", handler);
      expect(subject.__events__["some-event"].length).to.equal(1);
    });
  });

  describe("before", () => {
    let beforeHandler;

    beforeEach(function() {
      beforeHandler = sinon.spy();
      subject.on("some-event", handler);
      subject.before("some-event", beforeHandler);
    });

    it("prepends the handler to the events", () => {
      expect(first(subject.__events__["some-event"]).handler).to.equal(beforeHandler);
    });
  });

  describe("off", () => {
    beforeEach(() => {
      subject.on("some-event", handler);
    });

    it("removes all handlers from an event if only the event name is passed", () => {
      subject.off("some-event");
      expect(subject.__events__["some-event"].length).to.equal(0);
    });

    it("removes an event handler if the hander is passed", () => {
      subject.on("some-event", foreignContext.handler);
      subject.off("some-event", handler);
      expect(subject.__events__["some-event"].length).to.equal(1);
    });
  });

  describe("trigger", () => {
    beforeEach(() => {
      subject.on("some-event", handler);
      subject.trigger("some-event", "one", "two");
      subject.on("boundHandler", foreignContext.handler, foreignContext);
      subject.trigger("boundHandler");
    });

    it("triggers events", () => {
      expect(handler.called).to.be.true;
    });

    it("deduplicates the handlers", () => {
      expect(handler.callCount).to.equal(1);
    });

    it("binds a context to the event handler", () => {
      expect(foreignContext.value).to.equal("changed");
    });

    it("passes the tail of the arguments array to the handler", () => {
      expect(handler.calledWith("one", "two")).to.be.true;
    });
  });
});
