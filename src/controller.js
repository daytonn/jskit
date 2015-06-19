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
