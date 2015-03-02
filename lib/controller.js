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
    bindAll.apply(this, [this].concat(functions(this)));

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
