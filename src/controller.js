/**
  @module JSkit
  @class Controller
*/
JSkit.Controller = (function() {
  var bind = _.bind;
  var bindAll = _.bindAll;
  var cloneDeep = _.cloneDeep;
  var compact = _.compact;
  var defaults = _.defaults;
  var each = _.each;
  var extend = _.extend;
  var first = _.first;
  var flatten = _.flatten;
  var includes = _.includes;
  var isArray = _.isArray;
  var isFunction = _.isFunction;
  var isObject = _.isObject;
  var keys = _.keys;
  var last = _.last;
  var map = _.map;
  var reduce = _.reduce;
  var underscore = _.snakeCase;

  /**
    Get the full event name for a given controller and action.

    @private
    @method actionEventName
    @param controller {Object} object to check for the given action
    @param action {String} name to look up on given controller
    @return {String} Full event name for a given controller's action
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
    Normalize object and string actions into an array of tuples.

    @private
    @method normalizeActions
    @param controller {Object} whose actions you wish to normalize
  */
  function normalizeActions(controller) {
    controller.__actions__ = flatten(map(controller.actions, function(action) {
      return normalizeAction(action);
    }));
  }

  /**
    Normalize the given action into an action object.

    @private
    @method normalizeAction
    @param action {String} you wish to normalize
    @return {Array} array of normalized action objects
  */
  function normalizeAction(action) {
    return isObject(action) ? map(action, createActionObject) : [createActionObject(action, action)];
  }

  /**
    Create an action object from the given method and action.

    @private
    @method createActionObject
    @param method {String} associated with the given action
    @param name {String} of the given action
    @return {Object} object with the name and method of the given action
  */
  function createActionObject(method, name) {
    return { name: name, method: method };
  }

  /**
    Throw an error if the action method is not defined on the given controller.

    @private
    @method ensureActionIsDefined
    @param controller {Object} to ensure has the given action method
    @param {Srtring}
  */
  function ensureActionIsDefined(controller, action) {
    if (!isFunction(controller[action.method])) {
      throw new Error(controller.name + ' action "' + action.name + ":" + action.method + '" method is undefined');
    }
  }

  /**
    Register all the action for a given controller.

    @private
    @method registerActions
    @param controller {Object} to register actions on
  */
  function registerActions(controller) {
    each(controller.__actions__, function(action) {
      ensureActionIsDefined(controller, action);
      controller.dispatcher.on(actionEventName(controller, action.name), controller[action.method], controller);
    });
  }

  /**
    Normalize the element objects for a given controller.

    @private
    @method normalizeControllerElements
    @param controller {Object} to normalize elements of
  */
  function normalizeControllerElements(controller) {
    controller.__elements__ = reduce(controller.elements, function(memo, elements, action) {
      memo[action] = normalizeElements(elements);
      return memo;
    }, {});
  }

  /**
    Normalize the given elements to a common format.

    @private
    @method normalizeElements
    @param elements {Object} object to normalize
    @return {Object} normalized elements object
  */
  function normalizeElements(elements) {
    return reduce(elements, function(memo, selector, name) {
      if (_.isArray(selector)) selector = first(selector);
      memo[name] = selector;
      return memo;
    }, {});
  }

  /**
    Normalize the event for a given controller.

    @private
    @method normalizeControllerEvents
    @param controller controller {Object} with which to register events
  */
  function normalizeControllerEvents(controller) {
    controller.__events__ = reduce(controller.elements, function(memo, elements, action) {
      memo[action] = normalizeEvents(elements);
      return memo;
    }, {});
  }


  /**
    Normalize the given events into a common format.

    @private
    @method normalizeEvents
    @param elements {Object} object of events to normalize
  */
  function normalizeEvents(elements) {
    return reduce(elements, function(memo, selector, name) {
      if (_.isArray(selector)) memo["$" + name] = last(selector);

      return memo;
    }, {});
  }

  /**
    Automatically register the all action.

    @private
    @method registerAllAction
    @param controller {Controller}
  */
  function registerAllAction(controller) {
    if (!includes(controller.actions, "all")) controller.actions.unshift("all");
  }

  /**
    Convenience method to determine whether a given action is
    a mapped action

    @private
    @method isMappedAction
    @param action {Object}
  */
  function isMappedAction(action) {
    return action.name != action.method;
  }


  /**
    Use jQuery or querySelector all to find a DOM element.

    @private
    @method findInDOM
    @param selector {String}
  */
  function findInDOM(selector) {
    var finder = $ ? $ : document.querySelectorAll;
    return finder(selector);
  }

  function cacheElements(controller, action) {
    if (!action) throw new Error("JSkit.Controller.cacheElements: action is undefined");

    var actionElements = controller.__elements__[action];
    if (actionElements) {
      each(actionElements, function(selector, name) {
        var element = controller["$" + name] = findInDOM(selector);

        if (!element.length) {
          throw new Error("JSkit.Controller.cacheElements: " + selector + " is not in the DOM");
        }
      });
    }
  }

  function decorateCacheElements(controller) {
    controller.cacheElements = function(action) {
      return cacheElements(controller, action);
    };
  }

  function registerActionEvents(controller, action) {
    each(controller.__events__[action], function(events, element) {
      if (!controller[element]) cacheElements(controller, action);
      registerElementEvents(controller, element, events);
    });
  }

  function registerElementEvents(controller, element, events) {
    var eventsBinder = bind(eventsBinderFor(events), controller);
    var on = bind($.prototype.on, controller[element]);
    eventsBinder(on);
  }

  function eventsBinderFor(events) {
    if(events instanceof Function) {
      return events;
    }

    return function(on) {
      var controller = this;
      each(events, function(handler, evnt) {
        on(evnt, controller[handler]);
      });
    };
  }

  function decorateRegisterEvents(controller) {
    controller.registerEvents = function(action) {
      return registerActionEvents(controller, action);
    };
  }

  function restrictKeywords(attrs) {
    var keywords = [
      "registerEvents",
      "registerActions",
      "cacheElements",
      "actionEventName"
    ];

    each(keys(attrs), function(keyword) {
      if (includes(keywords, keyword)) {
        throw new Error("JSkit.Controller.create: " + keyword + " is a restricted keyword");
      }
    });
  }

  return {
    create: function(attrs) {
      attrs = extend({}, attrs);
      if (!attrs.name) throw new Error("JSkit.Controller: name is undefined");
      restrictKeywords(attrs);
      var controller = defaults(attrs, {
        actions: [],
        channel: "controller",
        controllerEventName: underscore(attrs.name),
        dispatcher: JSkit.Dispatcher.create(),
        elements: {},
        eventSeparator: ":",
        namespace: "",
        initialize: function() {},
        all: function() {},
        actionEventName: function(action) {
          return actionEventName(this, action);
        }
      });

      bindAll(controller);
      registerAllAction(controller);
      normalizeActions(controller);
      registerActions(controller);
      normalizeControllerElements(controller);
      normalizeControllerEvents(controller);
      decorateCacheElements(controller);
      decorateRegisterEvents(controller);

      controller.initialize();

      return controller;
    }
  };
})();
