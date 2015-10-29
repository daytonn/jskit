/**
 * @module JSkit
 * @class Controller
*/
JSkit.Controller = (function() {
  var bindAll = _.bindAll;
  var compact = _.compact;
  var defaults = _.defaults;
  var each = _.each;
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

  function actionEventName(controller, action) {
    return compact([
      controller.namespace,
      controller.channel,
      controller.controllerEventName,
      action
    ]).join(controller.eventSeparator);
  }

  function normalizeActions(controller) {
    controller.__actions__ = flatten(map(controller.actions, function(action) {
      return normalizeAction(action);
    }));
  }

  function normalizeAction(action) {
    return isObject(action) ? map(action, createActionObject) : [createActionObject(action, action)];
  }

  function createActionObject(method, action) {
    return { name: action, method: method };
  }

  function ensureActionIsDefined(controller, action) {
    if (!isFunction(controller[action.method])) {
      throw new Error(controller.name + ' action "' + action.name + ":" + action.method + '" method is undefined');
    }
  }

  function registerActions(controller) {
    each(controller.__actions__, function(action) {
      ensureActionIsDefined(controller, action);
      controller.dispatcher.on(actionEventName(controller, action.name), controller[action.method], controller);
    });
  }

  function normalizeElements(controller) {
    controller.__elements__ = reduce(controller.elements, function(memo, elements, action) {
      memo[action] = normalizeActionElements(elements);
      return memo;
    }, {});
  }

  function normalizeActionElements(elements) {
    return reduce(elements, function(memo, selector, name) {
      if (_.isArray(selector)) selector = first(selector);
      memo[name] = selector;
      return memo;
    }, {});
  }

  function normalizeEvents(controller) {
    controller.__events__ = reduce(controller.elements, function(memo, elements, action) {
      memo[action] = normalizeActionEvents(elements);
      return memo;
    }, {});
  }

  function normalizeActionEvents(elements) {
    return reduce(elements, function(memo, selector, name) {
      if (_.isArray(selector)) memo["$" + name] = last(selector);

      return memo;
    }, {});
  }

  function registerAllAction(controller) {
    if (!includes(controller.actions, "all")) controller.actions.unshift("all");
  }

  function cacheElements(controller, action) {
    if (!action) throw new Error("JSkit.Controller.cacheElements: action is undefined");

    var actionElements = controller.__elements__[action];
    if (actionElements) {
      each(actionElements, function(selector, name) {
        var finder = $ ? $ : function(selector) {
          return document.querySelectorAll(selector);
        };
        var element = controller["$" + name] = finder(selector);

        if (!element.length) {
          throw new Error("JSkit.Controller.cacheElements: " + selector + " is not in the DOM");
        }
      });
    }
  }

  function decorateCacheElements(controller) {
    controller.cacheElements = function(action) {
      return cacheElements(controller, action);
    }
  }

  function registerEvents(controller, action) {
    each(controller.__events__[action], function(events, element) {
      if (!controller[element]) cacheElements(controller, action);
      registerElementEvents(controller, element, events);
    });
  }

  function registerElementEvents(controller, element, events) {
    each(events, function(handler, evnt) {
      controller[element].on(evnt, controller[handler]);
    });
  }

  function decorateRegisterEvents(controller) {
    controller.registerEvents = function(action) {
      return registerEvents(controller, action);
    }
  }

  return {
    create: function(attrs) {
      attrs = attrs || {};
      if (!attrs.name) throw new Error("JSkit.Controller: name is undefined");

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
      normalizeElements(controller);
      normalizeEvents(controller);
      decorateCacheElements(controller);
      decorateRegisterEvents(controller);

      controller.initialize();

      return controller;
    }
  }
})();
