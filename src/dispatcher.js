/**
 * @module JSkit
 * @class Dispatcher
*/
JSkit.Dispatcher = (function() {
  var contains = _.contains;
  var pluck = _.pluck;

  /**
    Get all handler functions for a given dispatcher and event.

    @method getEventHandlers
    @param {Dispatcher} dispatcher
    @param {String} eventName event name for which you wish to find handlers
    @return {Array} handler functions for the given event
  */
  function getEventHandlers(dispatcher, eventName) {
    dispatcher.__events__[eventName] = dispatcher.__events__[eventName] || [];
    return dispatcher.__events__[eventName];
  }

  /**
    Create a handler object that contains the context and handler function

    @method createHandlerObject
    @param {Object,Function} context `this` context for handler function (defaults to `null`)
    @param {Function} handler function to handle event
    @return {Object} handler object with `handler` and `context`
  */
  function createHandlerObject(context, handler) {
    context = context || null;
    return {
      context: context,
      handler: handler
    };
  }

  /**
    Add an event handler to the array of registered handlers.

    @method registerHandler
    @param {Array} registeredHandlers registered handlers for an event
    @param {Function} eventHandler to handle event
    @param {String} [method="push"] method to add the handler to the array
  */
  function registerHandler(registeredHandlers, eventHandler, method) {
    method = method || "push";
    if (!contains(pluck(registeredHandlers, "handler"), eventHandler.handler)) {
      registeredHandlers[method](eventHandler);
    }
  }

  return {
    /**
      Create a new Dispatcher object.

      @static
      @method create
      @return {Dispatcher}
    */
    create: function() {
      return {
        __events__: {},

        /**
          Register a handler to a given event.

          @method on
          @param {String} eventName Name of the event
          @param {Function} handler Function to handle the event
          @param {Controller} [context] `this` context of the handler
        */
        on: function(eventName, handler, context) {
          var eventHandler = createHandlerObject(context, handler);
          var registeredHandlers = getEventHandlers(this, eventName);
          registerHandler(registeredHandlers, eventHandler);
        },

        /**
          Register a handler to a given event that will
          fire before the handlers registerd with `on`.

          @method before
          @param {String} eventName Name of the event
          @param {Function} handler Function to handle the event
          @param {Controller} [context] `this` context of the handler
        */
        before: function(eventName, handler, context) {
          var eventHandler = createHandlerObject(context, handler);
          var registeredHandlers = getEventHandlers(this, eventName);
          registerHandler(registeredHandlers, eventHandler, "unshift");
        },

        /**
          Remove a handler from a given event.

          @method off
          @param {String} eventName Name of the event
          @param {Function} handler Function to unbind from the `event`
        */
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

        /**
          Trigger a given event, causing all handlers
          for that event to be fired.

          @method trigger
          @param {String} eventName Name of the event
        */
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
  };
})();
