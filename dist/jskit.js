/**
 * JSKit global namespace object
 *
 * @module JSKit
 * @class JSKit
*/
var JSKit = (function() {
  if (!_) throw new Error("JSKit: lodash or underscore is required");
  if (!$) throw new Error("JSKit: jQuery or equivalent is required");

  return {
    /**
     * Returns a new Application object.
     *
     * @method createApplication
     * @return {Application}
    */
    createApplication: function() {
      return JSKit.Application.create();
    }
  };
})();

/**
 * Controller
 *
 * @module JSKit
 * @class Dispatcher
*/
JSKit.Dispatcher = (function() {
  var contains = _.contains;
  var pluck = _.pluck;

  /**
    Get all handler functions for a given dispatcher and event.

    @method getEventHandlers
    @param {Dispatcher} dispatcher
    @param {String} eventName Event name for which you wish to find handlers
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
    @param {Function} handler Function to handle event
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
    @param {Array} registeredHandlers Array of registered handlers for an event
    @param {Function} eventHandler Function to handle event
    @param {String} [method=push] Method to add the handler to the array
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
      @method Dispatcher.create
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

/**
 * Controller
 *
 * @module JSKit
 * @class Controller
*/
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

  /**
   * Take a string and put underscores between names and delimiters
   *
   * @private
   * @method constantize
   * @param {String} string
   * @return {String}
  */
  function underscore(string) {
    string = string || "";
    return string.replace(/([A-Z])/g, " $1").replace(/^\s?/, "").replace(/-|\s/g, "_").toLowerCase();
  }

  /**
   * Register the controller's actions to the dispatcher
   *
   * @private
   * @method registerActions
   * @param {Controller} controller
  */
  function registerActions(controller) {
    each(controller.actions, function(action) {
      var actionMap = mapAction(action);
      ensureActionIsDefined(controller, actionMap);
      controller.dispatcher.on(actionEventName(controller, actionMap.name), controller[actionMap.method], controller);
    }, controller);
  }

  /**
   * Take an action string or mapped action and return
   * an object containing the action name and method.
   *
   * @private
   * @method mapAction
   * @param {String,Object} action/mappedAction
   * @return {Object} actionMap
  */
  function mapAction(action) {
    var isMappedAction = isObject(action);
    var method = isMappedAction ? first(values(action)) : action;
    var name = isMappedAction ? first(keys(action)) : action;

    return { name: name, method: method };
  }

  /**
   * Take a controller and an actionMap and determine if
   * the action is defined on the controller. If not, throw
   * an error.
   *
   * @private
   * @method ensureActionIsDefined
   * @param {Controller} controller
   * @param {Object} actionMap
  */
  function ensureActionIsDefined(controller, actionMap) {
    if (!isFunc(controller[actionMap.method])) {
      throw new Error(controller.name + ' action "' + actionMap.name + ":" + actionMap.method + '" method is undefined');
    }
  }

  /**
   * Return an event name based on the controller properties
   * that make up an event name.
   *
   * @private
   * @method actionEventName
   * @param {Controller} controller
   * @param {String} action
   * @return String
  */
  function actionEventName(controller, action) {
    return compact([
      controller.namespace,
      controller.channel,
      controller.controllerEventName,
      action
    ]).join(controller.eventSeparator);
  }

  /**
   * Iterate over the given controller's elements object
   * and cache a reference to each selected element.
   *
   * @private
   * @method cacheElements
   * @param {Controller} controller
   * @param {String} action
  */
  function cacheElements(controller, action) {
    if (controller.elements[action]) {
      each(controller.elements[action], function(selector, name) {
        controller["$" + name] = $(selector);
      }, controller);
    }
  }

  /**
   * Iterate over the given action's events and register
   * the event handlers on each element.
   *
   * @private
   * @method registerEvents
   * @param {Controller} controller
   * @param {String} action
  */
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

  /**
   * Iterate over the controller's elements
   * and register to cache each action's events.
   *
   * @private
   * @method registerElementCaching
   * @param {Controller} controller
  */
  function registerElementCaching(controller) {
    each(controller.elements, function(elements, action) {
      controller.dispatcher.before(actionEventName(controller, action), function() {
        cacheElements(controller, action);
      }, controller);
    }, controller);
  }

  /**
   * Iterate over the controller's events
   * and register to handle each action's element events.
   *
   * @private
   * @method registerControllerEvents
   * @param {Controller} controller
  */
  function registerControllerEvents(controller) {
    each(controller.events, function(eventMap, action) {
      controller.dispatcher.on(actionEventName(controller, action), function() {
        registerEvents(controller, action);
      }, controller);
    }, controller);
  }

  return {
    /**
     * Factory function to create fresh controller objects
     * with the given attributes.
     *
     * @method JSKit.Controller.create
     * @static
     * @param {Object} [attrs={}]
     *
     * @return {Controller}
    */
    create: function(attrs) {
      attrs = attrs || {};
      if (!attrs.name) throw new Error("Controller.create(name): name is undefined");

      var controller = defaults(attrs, {
        /**
         * Array of actions to be wired up.
         *
         * @property actions
         * @type Array
         * @default []
        */
        actions: [],
        /**
         * Namespace that controller events are namespaced under.
         *
         * @property namespace
         * @type String
         * @default ""
        */
        namespace: "",
        /**
         * Channel that controller events use under namespace.
         *
         * @property channel
         * @type String
         * @default "controller"
        */
        channel: "controller",
        /**
         * Underscored name of controller for use in events.
         *
         * @property controllerEventName
         * @type String
         * @default "controller"
        */
        controllerEventName: underscore(attrs.name),
        /**
         * Event dispatcher for registering events.
         *
         * @property dispatcher
         * @type Dispatcher
         * @default JSKit.Dispatcher.create()
        */
        dispatcher: JSKit.Dispatcher.create(),
        /**
         * Object of element names/selectors to
         * cache per action.
         *
         * @property elements
         * @type Object
         * @default {}
        */
        elements: {},
        /**
         * Object of events for each action to
         * register on given elements.
         *
         * @property events
         * @type Object
         * @default {}
        */
        events: {},
        /**
         * String to seperate event name segments
         *
         * @property eventSeparator
         * @type String
         * @default ":"
        */
        eventSeparator: ":",
        /**
         * Default implementation that commits no operation
         * @method all
        */
        all: function() {},
        /**
         * Default implementation that commits no operation
         * @method initialize
        */
        initialize: function() {}
      });
      bindAll(controller);
      controller.actions.unshift("all");
      registerElementCaching(controller);
      registerControllerEvents(controller);
      registerActions(controller);

      controller.initialize();

      return controller;
    }
  };
})();

/**
 * Application
 *
 * @module JSKit
 * @class Application
*/
JSKit.Application = (function() {
  var extend = _.extend;
  var map = _.map;

  /**
   * Takes a string and creates a constant name
   * by uppercasing and camel-casing each word
   * delimited by a space.
   *
   * @private
   * @method constantize
   * @param {String} [string=""]
   * @return {String}
  */
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
    /**
     * Creates a new application object.
     *
     * @method JSKit.Application.create
     * @static
     * @return {Object} Application object
    */
    create: function() {
      var dispatcher = JSKit.Dispatcher.create();
      return {
        /**
         * Controllers namespace to store Controller objects built at runtime
         *
         * @property Controllers
         * @type Object
         * @default {}
        */
        Controllers: {},
        /**
         * Dispatcher to subcribe and publish events
         *
         * @property Dispatcher
         * @type Dispatcher
         * @default Dispatcher
        */
        Dispatcher: dispatcher,
        /**
         * Creates a controller with the given name and attributes
         * and returns it. It also saves a reference to the Controller
         * factory used to create the controller for testing purposes.
         *
         * @method createController
         * @param {String} name Name of the controller
         * @param {Object} [attributes={}] Controller attributes
         * @return {Controller} controller created
        */
        createController: function(name, attrs) {
          attrs = attrs || {};
          if (!name) throw new Error("Application.createController(name, attrs): name is undefined");
          attrs.name = name;
          var controllerName = constantize(name) + "Controller";
          /**
           * @class ControllerFactory
          */
          var factory = this[controllerName] = {
            /**
             * Creates a fresh controller object with the original defaults
             *
             * @method create
             * @param {Object} [attributes]
             * @return {Controller} controller
            */
            create: function(attributes) {
              attributes = attributes || { name: name };
              return JSKit.Controller.create(extend({}, attrs, attributes));
            }
          };

          this.Controllers[name] = factory.create({ dispatcher: dispatcher });

          return this.Controllers[name];
        }
      };
    }
  };
})();
