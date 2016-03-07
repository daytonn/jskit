import expect, { createSpy } from 'expect'
import Dispatcher from '../src/dispatcher'
import { first } from 'lodash'

describe('Dispatcher', () => {
  let subject

  beforeEach(() => {
    subject = Dispatcher.create()
  })

  describe('on', () => {
    let handler
    beforeEach(() => {
      handler = () => {}
      subject.on('some-event', handler)
    })

    it('registers a handler for an event', () => {
      var eventHandler = first(subject.__events__['some-event']).handler
      expect(eventHandler).toEqual(handler)
    })

    it('does not double register a handler', () => {
      subject.on('some-event', handler)
      expect(subject.__events__['some-event'].length).toEqual(1)
    })

    it('registers a handler with the same function but different context', () => {
      subject.on('some-event', handler, {})
      expect(subject.__events__['some-event'].length).toEqual(2)
    })
  })

  describe('before', () => {
    let handler
    let beforeHandler

    beforeEach(() => {
      handler = () => {}
      beforeHandler = () => {}
      subject.on('some-event', handler)
      subject.before('some-event', beforeHandler)
    })

    it('prepends the handler to the events', () => {
      expect(first(subject.__events__['some-event']).handler).toEqual(beforeHandler)
    })
  })

  describe('off', () => {
    let handler
    beforeEach(() => {
      handler = () => {}
    })

    it('removes all handlers from an event if only the event name is passed', () => {
      subject.on('some-event', handler)
      subject.off('some-event')

      expect(subject.__events__['some-event'].length).toEqual(0)
    })

    it('removes an event handler if the hander is passed', () => {
      let foreignContext = {
        value: 'foreign',
        handler() {}
      }

      subject.on('some-event', handler)
      subject.on('some-event', foreignContext.handler)

      subject.off('some-event', handler)

      expect(subject.__events__['some-event'].length).toEqual(1)
    })
  })

  describe('trigger', () => {
    let handler
    beforeEach(() => {
      handler = createSpy()
      subject.on('some-event', handler)
    })

    it('triggers events', () => {
      subject.trigger('some-event', 'one', 'two')
      expect(handler).toHaveBeenCalled()
    })

    it('deduplicates the handlers', () => {
      subject.on('some-event', handler)
      subject.trigger('some-event', 'one', 'two')

      expect(handler).toHaveBeenCalled()
      expect(handler.calls.length).toEqual(1)
    })

    it('binds a context to the event handler', (done) => {
      function handler() {
        expect(this.value).toEqual('test')
        done()
      }

      subject.on("boundHandler", handler, { value: 'test' })
      subject.trigger("boundHandler")
    })

    it('passes subsequent parameters to the handler', (done) => {
      let handler = (one, two) => {
        expect(one).toEqual('one')
        expect(two).toEqual('two')
        done()
      }

      subject.on('some-event', handler)
      subject.trigger('some-event', 'one', 'two')
    })
  })
})
