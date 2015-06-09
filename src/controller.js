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
