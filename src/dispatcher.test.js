/* eslint no-magic-numbers: 0 */
import { first } from "list-comprehension"
import { toArray } from "utils"
import Dispatcher from "dispatcher"

describe("Dispatcher", () => {
  let subject
  let handler
  let sandbox
  let jskitId
  let handlerCalled
  let handlerCallCount
  let handlerCalls

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    jskitId = "jskitId"
    handlerCalled = false
    handlerCallCount = 0
    handlerCalls = []
    handler = function() {
      handlerCalled = true
      handlerCallCount += 1
      handlerCalls.push(toArray(arguments))
      this.value = "changed"
    }
    handler.__jskitId__ = jskitId
    subject = new Dispatcher()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe("on", () => {
    it("requires a handler to have a __jskitId__", () => {
      expect(() => subject.on("foo", () => {})).to.throw("JSKit - Dispatcher.on(event, handler, context): handler.__jskitId__ is undefined but required")
    })

    it("register a handler for an event", () => {
      subject.on("some-event", handler)
      let eventHandler = first(subject.__events__["some-event"]).handler
      expect(eventHandler).to.equal(handler)
    })

    it("does not double register a handler", function() {
      subject.on("some-event", handler)
      subject.on("some-event", handler)
      expect(subject.__events__["some-event"].length).to.equal(1)
    })
  })

  describe("before", () => {
    var beforeHandler

    beforeEach(() => {
      beforeHandler = sandbox.spy()
      subject.on("some-event", handler)
      subject.before("some-event", beforeHandler)
    })

    it("prepends the handler to the events", () => {
      expect(first(subject.__events__["some-event"]).handler).to.equal(beforeHandler)
    })
  })

  describe("off", () => {
    beforeEach(() => {
      subject.on("some-event", handler)
    })

    it("requires an event", () => {
      expect(() => subject.off()).to.throw("JSKit - Dispatcher.off(event, handler): event is undefined but required")
    })

    it("removes all handlers from an event if only the event name is passed", () => {
      subject.off("some-event")
      expect(subject.__events__["some-event"].length).to.equal(0)
    })

    it("removes an event handler if the hander is passed", () => {
      subject.on("some-event", handler)
      subject.off("some-event", handler)
      expect(subject.__events__["some-event"].length).to.equal(1)
    })
  })

  describe("trigger", () => {
    let context
    beforeEach(() => {
      context = { value: "original" }
      subject.on("some-event", handler, context)
      subject.trigger("some-event", "one", "two")
    })

    it("triggers events", () => {
      expect(handlerCalled).to.be.true
    })

    it("deduplicates the handlers", () => {
      expect(handlerCallCount).to.equal(1)
    })

    it("binds a context to the event handler", () => {
      expect(context.value).to.equal("changed")
    })

    it("passes the tail of the arguments array to the handler", () => {
      expect(handlerCalls[0]).to.contain("one")
      expect(handlerCalls[0]).to.contain("two")
    })
  })
})
