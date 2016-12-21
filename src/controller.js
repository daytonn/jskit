import Dispatcher from 'dispatcher'

import {
  compact,
  each,
  first,
  flatten,
  functions,
  includes,
  last,
  mapObject,
  reduce,
} from 'list-comprehension'

import {
    isFunction,
    isObject,
    snakeCase,
} from 'utils'

function restrictKeywords(attrs) {
  var keywords = [
    'registerEvents',
    'registerActions',
    'cacheElements',
    'eventNameForAction'
  ]

  each(Object.keys(attrs), keyword => {
    if (includes(keywords, keyword)) {
      throw new Error(`Controller.create: ${keyword} is a restricted keyword`)
    }
  })
}

function eventNameForAction(controller, action) {
  return compact([
    controller.namespace,
    controller.channel,
    controller.controllerEventName,
    action
  ]).join(controller.eventSeparator)
}

function registerAllAction(controller) {
  if (!includes(controller.actions, 'all')) controller.actions.unshift('all')
}

function normalizeActions(controller) {
  controller.__actions__ = flatten(controller.actions.map(action => normalizeAction(action)))
}

function normalizeAction(action) {
  return isObject(action) ? mapObject(action, createActionObject) : [createActionObject(action, action)]
}

function createActionObject(method, name) {
  return { name: name, method: method }
}

function ensureActionIsDefined(controller, action) {
  if (!isFunction(controller[action.method])) {
    throw new Error(`${controller.name} action ${action.name}:${action.method} method is undefined`)
  }
}

function registerActions(controller) {
  each(controller.__actions__, action => {
    ensureActionIsDefined(controller, action)
    controller.dispatcher.on(eventNameForAction(controller, action.name), controller[action.method], controller)
  })
}

function normalizeControllerElements(controller) {
  controller.__elements__ = reduce(controller.elements, (memo, elements, action) => {
    memo[action] = normalizeElements(elements)
    return memo
  }, {})
}

function normalizeElements(elements) {
  return reduce(elements, (memo, selector, name) => {
    memo[name] = _.isArray(selector) ? first(selector) : selector
    return memo
  }, {})
}

function normalizeControllerEvents(controller) {
  controller.__events__ = reduce(controller.elements, (memo, elements, action) => {
    memo[action] = normalizeEvents(elements)
    return memo
  }, {})
}

function normalizeEvents(elements) {
  return reduce(elements, (memo, selector, name) => {
    if (_.isArray(selector)) memo[`$${name}`] = last(selector)

    return memo
  }, {})
}

function nativeFind(selector) {
  return document.querySelectorAll(selector)
}

function findInDOM(selector) {
  var finder = $ ? $ : nativeFind
  return finder(selector)
}

function cacheElements(controller, action) {
  if (!action) throw new Error('Controller.cacheElements: action is undefined')

  var actionElements = controller.__elements__[action]

  if (actionElements) {
    each(actionElements, (selector, name) => {
      var element = controller['$' + name] = findInDOM(selector)

      if (!element.length) {
        throw new Error(`Controller.cacheElements: ${selector} is not in the DOM`)
      }
    })
  }
}

function decorateCacheElements(controller) {
  controller.cacheElements = function(action) {
    return cacheElements(controller, action)
  }
}

function registerActionEvents(controller, action) {
  each(controller.__events__[action], (events, element) => {
    if (!controller[element]) cacheElements(controller, action)
    registerElementEvents(controller, element, events)
  })
}

function registerElementEvents(controller, element, events) {
  var eventsBinder = eventsBinderFor(events).bind(controller)
  var on = $.prototype.on.bind(controller[element])
  eventsBinder(on)
}

function eventsBinderFor(events) {
  if (events instanceof Function) {
    return events
  }

  return function(on) {
    var controller = this

    each(events, function(handler, evnt) {
      on(evnt, controller[handler])
    })
  }
}

function decorateRegisterEvents(controller) {
  controller.registerEvents = function(action) {
    return registerActionEvents(controller, action)
  }
}

function registerCacheElementsForActions(controller) {
  each(controller.__actions__, function(action) {
    var eventName = eventNameForAction(controller, action.name)
    controller.dispatcher.before(eventName, function() {
      return cacheElements(controller, action.name)
    })
  })
}

function registerControllerElementEvents(controller) {
  each(controller.__actions__, function(action) {
    var eventName = eventNameForAction(controller, action.name)
    controller.dispatcher.before(eventName, function() {
      return registerActionEvents(controller, action.name)
    })
  })
}

export default {
  create: function(attrs = {}) {
    if (!attrs.name) throw new Error('Controller.create(attributes): attributes.name is undefined')
    restrictKeywords(attrs)
    var controller = Object.assign({
      actions: [],
      channel: 'controller',
      controllerEventName: snakeCase(attrs.name),
      dispatcher: new Dispatcher(),
      elements: {},
      eventSeparator: ':',
      namespace: '',
      initialize() {},
      all() {},
      eventNameForAction(action) {
        return eventNameForAction(this, action)
      }
    }, attrs)

    each(functions(controller), function(func) {
      controller[func] = controller[func].bind(controller)
    })

    registerAllAction(controller)
    normalizeActions(controller)
    registerActions(controller)

    normalizeControllerEvents(controller)
    normalizeControllerElements(controller)

    registerControllerElementEvents(controller)
    registerCacheElementsForActions(controller)

    decorateCacheElements(controller)
    decorateRegisterEvents(controller)

    controller.initialize()

    return controller
  }
}

// function restrictKeywords(attrs) {
//   var keywords = [
//     'registerEvents',
//     'registerActions',
//     'cacheElements',
//     'eventNameForAction'
//   ]

//   Object.keys(attrs).forEach(keyword => {
//     if (includes(keywords, keyword)) {
//       throw new Error(`JSkit.Controller.create: ${keyword} is a restricted keyword`)
//     }
//   })
// }

// function eventNameForAction(controller, action) {
//   return compact([
//     controller.namespace,
//     controller.channel,
//     controller.controllerEventName,
//     action
//   ]).join(controller.eventSeparator)
// }

// function registerAllAction(controller) {
//   if (!includes(controller.actions, 'all')) controller.actions.unshift('all')
// }

// function normalizeActions(controller) {
//   debugger
//   controller.__actions__ = flatten(controller.actions.map(action => {
//     return normalizeAction(action)
//   }))
// }

// function normalizeAction(action) {
//   return isObject(action) ? action.map(createActionObject) : [createActionObject(action, action)]
// }

// function createActionObject(method, name) {
//   return { name: name, method: method }
// }

// function ensureActionIsDefined(controller, action) {
//   if (!isFunction(controller[action.method])) {
//     throw new Error(`${controller.name} action "${action.name}.${action.method}" method is undefined`)
//   }
// }

// function registerActions(controller) {
//   each(controller.__actions__, function(action) {
//     ensureActionIsDefined(controller, action)
//     controller.dispatcher.on(eventNameForAction(controller, action.name), controller[action.method], controller)
//   })
// }

// function normalizeControllerElements(controller) {
//   controller.__elements__ = reduce(controller.elements, function(memo, elements, action) {
//     memo[action] = normalizeElements(elements)
//     return memo
//   }, {})
// }

// function normalizeElements(elements) {
//   return reduce(elements, function(memo, selector, name) {
//     isArray(selector) ? memo[name] = first(selector) : memo[name] = selector
//   }, {})
// }

// function normalizeControllerEvents(controller) {
//   controller.__events__ = reduce(controller.elements, function(memo, elements, action) {
//     memo[action] = normalizeEvents(elements)
//     return memo
//   }, {})
// }

// function normalizeEvents(elements) {
//   return reduce(elements, function(memo, selector, name) {
//     if (_.isArray(selector)) memo['$' + name] = last(selector)

//     return memo
//   }, {})
// }

// function nativeFind(selector) {
//   return document.querySelectorAll(selector)
// }

// function findInDOM(selector) {
//   var finder = $ ? $ : nativeFind
//   return finder(selector)
// }

// function cacheElements(controller, action) {
//   if (!action) throw new Error('JSkit.Controller.cacheElements: action is undefined')

//   var actionElements = controller.__elements__[action]

//   if (actionElements) {
//     each(actionElements, function(selector, name) {
//       var element = controller['$' + name] = findInDOM(selector)

//       if (!element.length) {
//         throw new Error(`JSkit.Controller.cacheElements: ${selector} is not in the DOM`)
//       }
//     })
//   }
// }

// function decorateCacheElements(controller) {
//   controller.cacheElements = function(action) {
//     return cacheElements(controller, action)
//   }
// }

// function registerActionEvents(controller, action) {
//   each(controller.__events__[action], function(events, element) {
//     if (!controller[element]) cacheElements(controller, action)
//     registerElementEvents(controller, element, events)
//   })
// }

// function registerElementEvents(controller, element, events) {
//   var eventsBinder = bind(eventsBinderFor(events), controller)
//   var on = bind($.prototype.on, controller[element])
//   eventsBinder(on)
// }

// function eventsBinderFor(events) {
//   if (events instanceof Function) {
//     return events
//   }

//   return function(on) {
//     let controller = this
//     each(events, function(handler, evnt) {
//       on(evnt, controller[handler])
//     })
//   }
// }

// function decorateRegisterEvents(controller) {
//   controller.registerEvents = function(action) {
//     return registerActionEvents(controller, action)
//   }
// }

// function registerCacheElementsForActions(controller) {
//   each(controller.__actions__, function(action) {
//     var eventName = eventNameForAction(controller, action.name)
//     controller.dispatcher.before(eventName, function() {
//       return cacheElements(controller, action.name)
//     })
//   })
// }

// function registerControllerElementEvents(controller) {
//   each(controller.__actions__, function(action) {
//     var eventName = eventNameForAction(controller, action.name)
//     controller.dispatcher.before(eventName, function() {
//       return registerActionEvents(controller, action.name)
//     })
//   })
// }

// export default {
//   create(attrs = {}) {
//     if (!attrs.name) throw new Error('Controller.create(attributes): attributes.name is undefined')
//     restrictKeywords(attrs)
//     var controller = Object.assign(attrs, {
//       actions: [],
//       channel: 'controller',
//       controllerEventName: snakeCase(attrs.name),
//       dispatcher: new Dispatcher(),
//       elements: {},
//       eventSeparator: ':',
//       namespace: '',
//       initialize: function() {},
//       all: function() {},
//       eventNameForAction: function(action) {
//         return eventNameForAction(this, action)
//       }
//     })

//     each(functions(controller), function(func) {
//       controller[func] = controller[func] = controller[func].bind(controller)
//     })

//     registerAllAction(controller)
//     normalizeActions(controller)
//     registerActions(controller)

//     normalizeControllerEvents(controller)
//     normalizeControllerElements(controller)

//     registerControllerElementEvents(controller)
//     registerCacheElementsForActions(controller)

//     decorateCacheElements(controller)
//     decorateRegisterEvents(controller)

//     controller.initialize()

//     return controller
//   }
// }
