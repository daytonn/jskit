class Dispatcher {
  constructor() {
    this.__events__ = {};
  }

  on(eventName, handler, context) {
    var eventHandler = {
      context: context || null,
      handler: handler
    };

    var registeredHandlers = this.__events__[eventName] = this.__events__[eventName] || [];

    if (!_.contains(_.pluck(registeredHandlers, "handler"), handler)) {
      registeredHandlers.push(eventHandler);
    }
  }

  off(eventName, handler) {
    var registeredHandlers = this.__events__[eventName];
    var retainedHandlers = [];

    if (handler) {
      this.__events__[eventName] = _.reject(registeredHandlers, function(eventHandler) {
        return eventHandler.handler !== handler;
      });
    } else {
      this.__events__[eventName] = [];
    }
  }

  trigger(eventName) {
    var eventHhandlers = this.__events__[eventName] || [];
    var args = _.rest(arguments);

    _.each(eventHhandlers, function(eventHandler) {
      var handler = eventHandler.handler;
      var context = eventHandler.context;
      handler.apply(context, args);
    });
  }
}

export default Dispatcher;
