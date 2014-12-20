var _ = require("lodash");
var BaseController = require("./controller");
var Dispatcher = require("backbone-events-standalone");

function Application() {
  this.Controllers = {};
  this.Dispatcher = Dispatcher;
}

function createControllerInstance(attributes, name) {
  function Controller() { BaseController.call(this); }
  Controller.prototype = Object.create(BaseController.prototype);
  Controller.prototype.constructor = Controller;
  _.extend(Controller.prototype, attributes);
  this[name + "Controller"] = Controller;
  return new Controller;
}

function registerControllerActions(controller, actions, name, namespace) {
  _(actions).each(function(action) {
    if (!controller[action] || !_.isFunction(controller[action])) {
      throw new Error("'" + name + "' Controller has an action '" + action + "' defined with no corresponding method");
    }

    var eventName = _([namespace, "controller", underscoreName(name), action]).compact().join(":");
    this.Dispatcher.on(eventName, controller[action], controller);
  }, this);
}

function underscoreName(name) {
  return name.replace(/([A-Z])/g, " $1").replace(/^\s?/, "").replace(/-|\s/g, "_").toLowerCase();
}

function registerApplicationControllerActions(controller, namespace) {
  if (!controller.init) throw new Error("'Application' Controller: init is undefined");
  var eventName = _([namespace, "controller", "all"]).compact().join(":");
  this.Dispatcher.on(eventName, controller.init, controller);
}

Application.prototype.createController = function(name, attributes) {
  var controller = createControllerInstance.call(this, attributes, name);
  registerControllerActions.call(this, controller, attributes.actions, name, attributes.namespace);
  if (name.match(/^Application$/i)) registerApplicationControllerActions.call(this, controller, attributes.namespace);
  return this.Controllers[name] = controller;
};

module.exports = Application;
