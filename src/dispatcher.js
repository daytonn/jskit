import { tail, reject, none } from 'list-comprehension'
import { toArray, uniqueId } from 'utils'

function getEventHandlers(dispatcher, eventName) {
  dispatcher.__events__[eventName] = dispatcher.__events__[eventName] || []
  return dispatcher.__events__[eventName]
}

function createHandlerObject(context, handler) {
  return {
    context,
    handler,
    id: handler.__jskitId
  }
}

function registerHandler(registeredHandlers, eventHandler, method = 'push') {
  registeredHandlers[method](eventHandler)
}

function isUniqueEvent(registeredHandlers, handler, context) {
  return registeredHandlers.reduce((memo, registeredHandler) => {
    if (memo) memo = registerHandler.id !== handler.__jskitId && registeredHandler.context !== context
    return memo
  }, true)
}

export default class Dispatcher {
  constructor() {
    this.__events__ = {}
  }

  on(eventName, handler, context) {
    if (!handler.__jskitId) handler.__jskitId = uniqueId()
    var registeredHandlers = getEventHandlers(this, eventName)

    if (isUniqueEvent(registeredHandlers, handler, context)) {
      var eventHandler = createHandlerObject(context, handler)

      registerHandler(registeredHandlers, eventHandler)
    }
  }

  before(eventName, handler, context) {
    var eventHandler = createHandlerObject(context, handler)
    var registeredHandlers = getEventHandlers(this, eventName)
    registerHandler(registeredHandlers, eventHandler, 'unshift')
  }

  off(eventName, handler) {
    var registeredHandlers = this.__events__[eventName]
    this.__events__[eventName] = handler ? reject(registeredHandlers, eh => eh.handler !== handler) : []
  }

  trigger(eventName) {
    var eventHhandlers = this.__events__[eventName] || []
    var args = tail(toArray(arguments))

    eventHhandlers.forEach(eventHandler => {
      var handler = eventHandler.handler
      var context = eventHandler.context
      handler.apply(context, args)
    })
  }
}
