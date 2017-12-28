import Controller from "controller"
import Dispatcher from "dispatcher"

describe("Controller", () => {
  let subject
  let dispatcher
  let name
  let sandbox

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    name = "Test"
    dispatcher = new Dispatcher()
    subject = new Controller({ name, dispatcher })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe("constructor(props)", () => {
    it("requires props.name", () => {
      expect(() => new Controller()).to.throw("JSKit - new Controller(props): props.name is undefined but required")
    })

    it("requires props.dispatcher", () => {
      expect(() => new Controller({ name })).to.throw("JSKit - new Controller(props): props.dispatcher is undefined but required")
    })

    describe("props", () => {
      beforeEach(() => {
        subject = new Controller({
          name, dispatcher,
          actions: ["index", { mapped: "mappedAction" }],
          index: sandbox.spy(),
          mappedAction: sandbox.spy(),
        })
      })

      it("accepts optional actions", () => {
        expect(subject.attributes.actions).to.contain("index")
      })

      it("requires an action have a corresponding method", () => {
        expect(() => {
          new Controller({ // eslint-disable-line no-new
            name, dispatcher,
            actions: ["index"],
          })
        }).to.throw('JSKit - new Controller(props): there is no method "index" for action "index"')

        expect(() => {
          new Controller({ // eslint-disable-line no-new
            name, dispatcher,
            actions: [{ mapped: "mappedAction" }],
          })
        }).to.throw('JSKit - new Controller(props): there is no method "mappedAction" for action "mapped"')
      })

      it("tags action methods with unique ids", () => {
        let index = sandbox.spy()
        let mappedAction = sandbox.spy()

        subject = new Controller({
          name, dispatcher,
          index, mappedAction,
          actions: ["index", { mapped: "mappedAction" }],
        })

        expect(index.__jskitId__).to.be.a("string")
        expect(mappedAction.__jskitId__).to.match(/^[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}/)
        expect(index.__jskitId__).to.match(/^[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}/)
      })
    })
  })

  describe("initialize(...)", () => {
    it("has an initialize method", () => {
      expect(subject.attributes.initialize).to.be.a("function")
    })

    it("is an identity method", () => {
      expect(subject.attributes.initialize("foo")).to.equal("foo")
    })
  })

  describe("all(...)", () => {
    it("has an all method", () => {
      expect(subject.attributes.all).to.be.a("function")
    })

    it("is an identity method", () => {
      expect(subject.attributes.all("foo")).to.equal("foo")
    })
  })

  describe(".attributes", () => {
    it("has actions", () => {
      expect(subject.attributes.actions).to.be.an("array")
    })

    it("has an all action", () => {
      expect(subject.attributes.actions).to.contain("all")
    })

    it("has a default channel", () => {
      expect(subject.attributes.channel).to.eq("controller")
    })

    it("has an eventNamespace", () => {
      expect(subject.attributes.eventNamespace).to.equal("test")
    })

    it("has an eventSeparator", () => {
      expect(subject.attributes.eventSeparator).to.equal(":")
    })

    it("translates the name to snake_case", () => {
      subject = new Controller({ name: "Some Weird-Controller", dispatcher })
      expect(subject.attributes.eventNamespace).to.equal("some_weird_controller")
    })

    it("has an elements object", () => {
      expect(subject.attributes.elements).to.be.an("object")
    })

    it("does not copy the dispatcher to attributes", () => {
      expect(subject.attributes.dispatcher).to.be.undefined
    })

    describe(".__actions__", () => {
      let index
      let all
      let mappedAction
      let anotherAction

      beforeEach(() => {
        index = sandbox.spy()
        all = sandbox.spy()
        mappedAction = sandbox.spy()
        anotherAction = sandbox.spy()

        subject = new Controller({
          name, dispatcher,
          actions: ["index", { mapped: "mappedAction", anotherMapped: "anotherAction" }],
          all, index, mappedAction, anotherAction
        })
      })

      it("normalizes the actions and stores them in __actions__", () => {
        expect(subject.attributes.__actions__.all).to.equal(all)
        expect(subject.attributes.__actions__.index).to.equal(index)
        expect(subject.attributes.__actions__.mapped).to.equal(mappedAction)
        expect(subject.attributes.__actions__.anotherMapped).to.equal(anotherAction)
      })

      xit("registers actions with the dispatcher", () => {
        dispatcher.trigger("controller:test:all")
        expect(all).to.have.been.called
      })
    })
  })
})
