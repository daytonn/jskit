var JSKit = {};

JSKit.Dispatcher = (function() {
  function Dispatcher() {
    this.__events__ =  {};
  }

  _.assign(Dispatcher.prototype, {
    on: function(eventName, handler, context) {
      var eventHandler = {
        context: context || null,
        handler: handler
      };

      var registeredHandlers = this.__events__[eventName] = this.__events__[eventName] || [];

      if (!_.contains(_.pluck(registeredHandlers, "handler"), handler)) {
        registeredHandlers.push(eventHandler);
      }
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
  });

  return Dispatcher;
})();

JSKit.TestDispatcher = (function() {
  var assign = _.assign;
  var clone = _.clone;
  var contains = _.contains;
  var each = _.each;
  var first = _.first;
  var functions = _.functions;
  var isString = _.isString;
  var keys = _.keys;
  var map = _.map;
  var rest = _.rest;
  var toArray = _.toArray;
  var values = _.values;

  function spyOn(handler) {
    handler.called = false;
    handler.callCount = 0;
    handler.calls = [];
    return handler;
  }

  function mapAction(action) {
    var name;
    var method;

    name = isString(action) ? action : first(keys(action));
    method = isString(action) ? action : first(values(action));

    return { name: name, method: method };
  }

  function actionName(action) {
    var actionMap = mapAction(action);
    return isString(action) ? '"' + action + '"' :  '{ ' + actionMap.name + ': "' + actionMap.method + '" }';
  }

  function TestDispatcher() {
    this.listeners = [];
    this.events = {};
    this.shadowDispatcher = new JSKit.Dispatcher;
  }

  assign(TestDispatcher.prototype, {
    on: function(eventName, handler, controller) {
      if (!contains(this.listeners, controller)) this.spyOnControllerMethods(controller);
      var spy = spyOn(handler);

      this.events[eventName] = this.events[eventName] || [];
      this.events[eventName].push(spy);

      this.shadowDispatcher.on(eventName, function() {
        this.trackSpy(spy, arguments);
      }, this);
    },

    spyOnControllerMethods: function(controller) {
      var actionNames = map(controller.actions, function(action) { return actionName(action); });
      var _this = this;
      each(functions(controller), function(method) {
        if (!contains(actionNames, method)) {
          var unboundMethod = controller[method];
          controller[method] = function() {
            _this.trackSpy(controller[method], arguments);
            return unboundMethod.apply(controller, arguments);
          };
          spyOn(controller[method]);
        }
      }, this);
      this.listeners.push(controller);
    },

    trigger: function(eventName, handler, context) {
      this.shadowDispatcher.trigger(eventName, handler, context);
    },

    trackSpy: function(spy, args) {
      spy.callCount += 1;
      spy.called = true;
      spy.calls.push({ args: toArray(args) });
    },

    hasAction: function(controller, action) {
      var actionExists = false;

      controller.actions.forEach(function(a) {
        if (actionName(a) === actionName(action)) actionExists = true;
      });

      if (!actionExists) return false;

      var actionMap = mapAction(action);
      var handler = controller[actionMap.method];

      var eventName = controller.actionEventName(actionMap.name);
      var cachedCount = handler.callCount;

      controller.dispatcher.trigger(eventName);

      return handler.callCount > cachedCount;
    },

    off: function() {}
  });

  return TestDispatcher;
})();

JSKit.Controller = (function() {
  var bindAll = _.bindAll;
  var compact = _.compact;
  var defaults = _.defaults;
  var each = _.each;
  var assign = _.assign;
  var first = _.first;
  var functions = _.functions;
  var isFunction = _.isFunction;
  var isObject = _.isObject;
  var keys = _.keys;
  var uniq = _.uniq;
  var values = _.values;

  function Controller(dispatcher, attrs) {
    if (!dispatcher) throw new Error(this.className + ": dispatcher is undefined");
    assign(this, attrs, this);
    this.dispatcher = dispatcher;
    bindAll(this);

    setControllerDefaults.call(this);
    this.actions.unshift("all");
    registerActions.call(this);

    this.initialize();
  }

  assign(Controller.prototype, {
    initialize: function() {},
    all: function() {},
    actionEventName: function(action) {
      return compact([this.namespace, this.channel, this.controllerEventName, action]).join(this.eventSeparator);
    }
  });

  return Controller;

  // private

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

  function underscore(string) {
    string = string || "";
    return string.replace(/([A-Z])/g, " $1").replace(/^\s?/, "").replace(/-|\s/g, "_").toLowerCase();
  }

  function ensureActionIsDefined(actionMap) {
    if (!isFunction(this[actionMap.method])) throw new Error(this.className + " action \"" + actionMap.name + this.eventSeparator + actionMap.method + "\" method is undefined");
  }

  function mapAction(action) {
    var isMappedAction = isObject(action);
    var method = isMappedAction ? first(values(action)) : action;
    var name = isMappedAction ? first(keys(action)) : action;

    return { name: name, method: method };
  }

  function registerActions(dispatcher) {
    each(this.actions, function(action) {
      var actionMap = mapAction(action);
      ensureActionIsDefined.call(this, actionMap);
      this.dispatcher.on(this.actionEventName(actionMap.name), this[actionMap.method], this);
    }, this);
  }

  function setControllerDefaults() {
    this.name = this.name || "Anonymous";
    defaults(this, {
      eventSeparator: ":",
      actions: [],
      channel: "controller",
      className: constantize(this.name) + "Controller",
      controllerEventName: underscore(this.name)
    });
  }
})();

JSKit.Application = (function() {
  var clone = _.clone;
  var assign = _.assign;
  var first = _.first;
  var map = _.map;

  function Application() {
    this.Controllers = {};
    this.Dispatcher = new JSKit.Dispatcher;
  }

  Application.prototype.createController = function(name, attrs) {
    var dispatcher = attrs.dispatcher || this.Dispatcher;
    if (attrs.dispatcher) delete attrs.dispatcher;

    name = constantize(name);
    assign(attrs, { name: name });

    function Controller() { JSKit.Controller.apply(this, arguments); }
    assign(Controller.prototype, JSKit.Controller.prototype, attrs);
    this[attrs.name + "Controller"] = Controller;
    this.Controllers[name] = new Controller(dispatcher, attrs);

    return this.Controllers[name];
  };

  return Application;

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

})();

JSKit.createApplication = function() {
  return new JSKit.Application;
};
