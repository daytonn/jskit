if (!_) throw new Error("JSKit: lodash or underscore is required");
var JSKit = {};

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

JSKit.Controller = (function() {
  var bindAll = _.bindAll;
  var compact = _.compact;
  var defaults = _.defaults;
  var each = _.each;
  var first = _.first;
  var functions = _.functions;
  var isFunc = _.isFunction;
  var isObject = _.isObject;
  var keys = _.keys;
  var uniq = _.uniq;
  var values = _.values;

  function underscore(string) {
    string = string || "";
    return string.replace(/([A-Z])/g, " $1").replace(/^\s?/, "").replace(/-|\s/g, "_").toLowerCase();
  }

  function registerActions(controller) {
    each(controller.actions, function(action) {
      var actionMap = mapAction(action);
      ensureActionIsDefined(controller, actionMap);
      controller.dispatcher.on(actionEventName(controller, actionMap.name), controller[actionMap.method], controller);
    }, controller);
  }

  function mapAction(action) {
    var isMappedAction = isObject(action);
    var method = isMappedAction ? first(values(action)) : action;
    var name = isMappedAction ? first(keys(action)) : action;

    return { name: name, method: method };
  }

  function ensureActionIsDefined(controller, actionMap) {
    if (!isFunc(controller[actionMap.method])) {
      throw new Error(controller.name + ' action "' + actionMap.name + ":" + actionMap.method + '" method is undefined');
    }
  }

  function actionEventName(controller, action) {
    return compact([
      controller.namespace,
      controller.channel,
      controller.controllerEventName,
      action
    ]).join(controller.eventSeparator);
  }

  function cacheElements(controller, action) {
    if (controller.elements[action]) {
      each(controller.elements[action], function(selector, name) {
        controller["$" + name] = $(selector);
      }, controller);
    }
  }

  function registerEvents(controller, action) {
    if (controller.events[action]) {
      each(controller.events[action], function(eventMap, element) {
        var evnt = first(keys(eventMap));
        var handler = controller[first(values(eventMap))];
        var $element = controller["$" + element];
        $element.on(evnt, handler);
      }, controller);
    }
  }

  function registerElementEvents(controller) {
    each(controller.elements, function(elements, action) {
      controller.dispatcher.before(actionEventName(controller, action), function() {
        cacheElements(controller, action);
      }, controller);
    }, controller);
  }

  function registerControllerEvents(controller) {
    each(controller.events, function(eventMap, action) {
      controller.dispatcher.on(actionEventName(controller, action), function() {
        registerEvents(controller, action);
      }, controller);
    }, controller);
  }

  return {
    create: function(attrs) {
      attrs = attrs || {};
      if (!attrs.name) throw new Error("Controller.create(name): name is undefined");

      var controller = defaults(attrs, {
        actions: [],
        channel: "controller",
        controllerEventName: underscore(attrs.name),
        dispatcher: JSKit.Dispatcher.create(),
        elements: {},
        events: {},
        eventSeparator: ":",
        all: function() {},
        initialize: function() {}
      });
      bindAll(controller);
      controller.actions.unshift("all");
      registerElementEvents(controller);
      registerControllerEvents(controller);
      registerActions(controller);

      controller.initialize();

      return controller;
    }
  };
})();

JSKit.Application = (function() {
  var extend = _.extend;
  var map = _.map;

  function constantize(string) {
    string = string || "";
    if (string.match(/_|-|\s/)) {
      var s = map(string.split(/_|-|\s/g), function(part, i) {
        return (i > 0) ? part.charAt(0).toUpperCase() + part.slice(1) : part.toLowerCase();
      }).join("");
      string = s;
    } else {
      string = string.toString();
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return {
    create: function() {
      var dispatcher = JSKit.Dispatcher.create();
      return {
        Controllers: {},
        Dispatcher: dispatcher,

        createController: function(name, attrs) {
          attrs = attrs || {};
          if (!name) throw new Error("Application.createController(name, attrs): name is undefined");
          attrs.name = name;

          var factory = {
            create: function(attributes) {
              attributes = attributes || { name: name };
              return JSKit.Controller.create(extend({}, attrs, attributes));
            }
          }
          this[constantize(name) + "Controller"] = factory;
          return this.Controllers[name] = factory.create({ dispatcher: dispatcher });
        }
      };
    }
  };
})();
