import { tail, reject, excludes } from "list-comprehension"
import { toArray, requireArgument, requireCondition } from "utils"

function getEventHandlers(dispatcher, event) {
  dispatcher.__events__[event] = dispatcher.__events__[event] || []
  return dispatcher.__events__[event]
}

function createHandlerObject(context, handler) {
  return {
    context,
    handler,
    id: handler.__jskitId
  }
}

function registerHandler(registeredHandlers, eventHandler, method = "push") {
  registeredHandlers[method](eventHandler)
}

function isUniqueEvent(registeredHandlers, handler, context) {
  return registeredHandlers.reduce((memo, registeredHandler) => {
    if (!memo) return false
    return registerHandler.id !== handler.__jskitId__ && registeredHandler.context !== context
  }, true)
}

export default class Dispatcher {
  constructor() {
    this.__events__ = {}
  }

  on(event, handler, context = null) {
    requireArgument(event, "JSKit - Dispatcher.on(event, handler, context): event is undefined but required")
    requireArgument(handler, "JSKit - Dispatcher.on(event, handler, context): handler is undefined but required")
    requireCondition(handler.__jskitId__, "JSKit - Dispatcher.on(event, handler, context): handler.__jskitId__ is undefined but required")

    var registeredHandlers = getEventHandlers(this, event)

    if (isUniqueEvent(registeredHandlers, handler, context)) {
      var eventHandler = createHandlerObject(context, handler)

      registerHandler(registeredHandlers, eventHandler)
    }
  }

  before(event, handler, context) {
    var eventHandler = createHandlerObject(context, handler)
    var registeredHandlers = getEventHandlers(this, event)
    registerHandler(registeredHandlers, eventHandler, "unshift")
  }

  off(event, handler) {
    requireArgument(event, "JSKit - Dispatcher.off(event, handler): event is undefined but required")

    var registeredHandlers = this.__events__[event]
    this.__events__[event] = handler ? reject(registeredHandlers, eh => eh.handler !== handler) : []
  }

  trigger(event) {
    var eventHhandlers = this.__events__[event] || []
    var args = tail(toArray(arguments))

    eventHhandlers.reduce((memo, eventHandler) => {
      var handler = eventHandler.handler
      var context = eventHandler.context

      if (excludes(memo, handler.__jskitId__)) {
        handler.apply(context, args)
        return memo.concat([handler.__jskitId__])
      }

      return memo
    }, [])
  }
}
