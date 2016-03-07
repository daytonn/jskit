import { none, each, tail } from './utils'

function getEventHandlers(dispatcher, eventName) {
  dispatcher.__events__[eventName] = dispatcher.__events__[eventName] || []
  return dispatcher.__events__[eventName]
}

function createHandlerObject(context=null, handler) {
  return {
    context: context,
    handler: handler
  }
}

function eventObjectsMatch(eventObjectA) {
  return function(eventObjectB) {
    var handlersMatch = eventObjectA.handler === eventObjectB.handler
    if (!handlersMatch) return false
    return eventObjectA.context === eventObjectB.context
  }
}

function eventObjectIsNotRegistered(registeredEventObjects, eventObject) {
  return none(registeredEventObjects, eventObjectsMatch(eventObject))
}

function registerHandler(registeredEventObjects, eventObject, method='push') {
  if (eventObjectIsNotRegistered(registeredEventObjects, eventObject)) {
    registeredEventObjects[method](eventObject)
  }
}

const Dispatcher = {
  create: function() {
    return {
      __events__: {},

      on(eventName, handler, context) {
        const eventHandler = createHandlerObject(context, handler)
        const registeredHandlers = getEventHandlers(this, eventName)
        registerHandler(registeredHandlers, eventHandler)
      },

      before(eventName, handler, context) {
        const eventHandler = createHandlerObject(context, handler)
        const registeredHandlers = getEventHandlers(this, eventName)
        registerHandler(registeredHandlers, eventHandler, 'unshift')
      },

      off(eventName, handler) {
        const registeredHandlers = this.__events__[eventName]

        if (handler) {
          this.__events__[eventName] = _.reject(registeredHandlers, function(eventHandler) {
            return eventHandler.handler !== handler
          })
        } else {
          this.__events__[eventName] = []
        }
      },

      trigger(eventName) {
        const eventHandlers = this.__events__[eventName] || []
        const args = tail(arguments)

        eventHandlers.forEach((eventHandler) => {
          const { handler, context } = eventHandler
          handler.apply(context, args)
        })
      }
    }
  }
}

export default Dispatcher
