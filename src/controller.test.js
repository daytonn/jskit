import Controller from 'controller'
import Dispatcher from 'dispatcher'

describe('Controller', () => {
  let subject
  let dispatcher
  let allCalled
  let indexCalled
  let actionCalled
  let anotherActionCalled

  beforeEach(() => {
    dispatcher = new Dispatcher()
    allCalled = false
    indexCalled = false
    actionCalled = false
    anotherActionCalled = false
    subject = Controller.create({
      name: 'Test',
      actions: ['index', { mapped: 'action', another: 'anotherAction' }],
      dispatcher: dispatcher,
      all() { allCalled = true },
      index() { indexCalled = true },
      action() { actionCalled = true },
      anotherAction() { anotherActionCalled = true }
    })
  })

  it('requires a name', () => {
    expect(() => Controller.create()).to.throw('Controller.create(attributes): attributes.name is undefined')
  })

  it('has a default dispatcher', () => {
    expect(subject.dispatcher).to.be.an.instanceof(Dispatcher)
  })

  it('has actions', () => {
    expect(subject.actions).to.be.an('array')
  })

  it('has a default channel', () => {
    expect(subject.channel).to.equal('controller')
  })

  it('has an initialize method', () => {
    expect(subject.initialize).to.be.a('function')
  })

  it('has a default controllerEventName', () => {
    expect(subject.controllerEventName).to.equal('test')
  })

  it('has an eventSeparator', () => {
    expect(subject.eventSeparator).to.equal(':')
  })

  it('has an all function', () => {
    expect(subject.all).to.be.a('Function')
  })

  it('has an elements object', () => {
    expect(subject.elements).to.be.an('Object')
  })

  describe('actions', () => {
    it('normalizes the actions', () => {
      let expectedActions = subject.__actions__.reduce((memo, action) => {
        memo[action.name] = action.method
        return memo
      }, {})

      expect(expectedActions.all).to.equal('all')
      expect(expectedActions.index).to.equal('index')
      expect(expectedActions.mapped).to.equal('action')
      expect(expectedActions.another).to.equal('anotherAction')
    })

    xit('registers action methods on the dispatcher', () => {
      dispatcher.trigger('controller:test:index')
      expect(indexCalled).to.be.true
    })

    xit('automatically wires the all event', () => {
      dispatcher.trigger('controller:test:all')
      expect(allCalled).to.equal(true)
    })

    xit('wires up mapped actions', () => {
      dispatcher.trigger('controller:test:mapped')
      expect(actionCalled).to.equal(true)
    })

    xit('wires up mapped actions with multiple maps', () => {
      dispatcher.trigger('controller:test:another')
      expect(anotherActionCalled).to.equal(true)
    })
  })
})
