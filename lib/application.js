/* jshint esnext: true */
import _ from "lodash";
import Dispatcher from "backbone-events-standalone";
import BaseController from "./controller";
import def from "./def";

function createControllerInstance(attributes, name) {
  class Controller extends BaseController {}
  _.extend(Controller.prototype, attributes);
  this[name + "Controller"] = Controller;
  return new Controller;
}

function underscoreName(name) {
  return name.replace(/([A-Z])/g, " $1").replace(/^\s?/, "").replace(/-|\s/g, "_").toLowerCase();
}

function ensureActionIsDefined(controller, action, method, name) {
  if (!controller[method] || !_.isFunction(controller[method])) {
    throw new Error("'" + name + "' Controller has an action '" + action + "' defined with no corresponding method");
  }
}

function registerControllerEvent(controller, action, method, name, namespace) {
  var eventName = _([namespace, "controller", underscoreName(name), action]).compact().join(":");
  this.Dispatcher.on(eventName, controller[method], controller);
}

function registerControllerActions(controller, actions, name, namespace) {
  actions && actions.forEach((action) => {
    var method = action;
    ensureActionIsDefined(controller, action, method, name);
    registerControllerEvent.call(this, controller, action, method, name, namespace);
  }, this);
}

function registerApplicationControllerActions(controller, namespace) {
  if (!controller.init) throw new Error("'Application' Controller: init is undefined");
  var eventName = _([namespace, "controller", "all"]).compact().join(":");
  this.Dispatcher.on(eventName, controller.init, controller);
}

function Application() {
  this.Controllers = {};
  this.Dispatcher = Dispatcher;
}

def(Application, "createController", function(name, attributes) {
  var controller = createControllerInstance.call(this, attributes, name);
  registerControllerActions.call(this, controller, attributes.actions, name, attributes.namespace);
  if (name.match(/^Application$/i)) {
    registerApplicationControllerActions.call(this, controller, attributes.namespace);
  }
  return this.Controllers[name] = controller;
});

export default Application;
