JSKit.Dispatcher = (function() {
  var contains = _.contains;
  var pluck = _.pluck;

  function getEventHandlers(context, eventName) {
    return context.__events__[eventName] = context.__events__[eventName] || [];
  }

  function createHandlerObject(context, handler) {
    context = context || null;
    return {
      context: context,
      handler: handler
    }
  }

  function registerHandler(registeredHandlers, eventHandler, method) {
    method = method || "push";
    if (!contains(pluck(registeredHandlers, "handler"), eventHandler.handler)) {
      registeredHandlers[method](eventHandler);
    }
  }

  return {
    create: function() {
      return {
        __events__: {},

        on: function(eventName, handler, context) {
          var eventHandler = createHandlerObject(context, handler);
          var registeredHandlers = getEventHandlers(this, eventName);
          registerHandler(registeredHandlers, eventHandler);
        },

        before: function(eventName, handler, context) {
          var eventHandler = createHandlerObject(context, handler);
          var registeredHandlers = getEventHandlers(this, eventName);
          registerHandler(registeredHandlers, eventHandler, "unshift");
        },

        off: function(eventName, handler) {
          var registeredHandlers = this.__events__[eventName];
          var retainedHandlers = [];

          if (handler) {
            this.__events__[eventName] = _.reject(registeredHandlers, function(eventHandler) {
              return eventHandler.handler !== handler;
            });
          } else {
            this.__events__[eventName] = [];
          }
        },

        trigger: function(eventName) {
          var eventHhandlers = this.__events__[eventName] || [];
          var args = _.rest(arguments);

          _.each(eventHhandlers, function(eventHandler) {
            var handler = eventHandler.handler;
            var context = eventHandler.context;
            handler.apply(context, args);
          });
        }
      };
    }
  }
})();
