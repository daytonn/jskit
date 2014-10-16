/* jshint esnext: true */
import _ from "lodash";
import Dispatcher from "backbone-events-standalone";
import BaseController from "./controller";

function createControllerInstance(attributes, name) {
  class Controller extends BaseController {}
  _.extend(Controller.prototype, attributes);
  this[`${name}Controller`] = Controller;
  return new Controller;
}

function underscoreName(name) {
  return name.replace(/([A-Z])/g, " $1").replace(/^\s?/, "").replace(/-|\s/g, "_").toLowerCase();
}

function ensureActionIsDefined(controller, action, method, name) {
  if (!controller[method] || !_.isFunction(controller[method])) {
    throw new Error(`'${name}' Controller has an action '${action}' defined with no corresponding method`);
  }
}

function registerControllerEvent(controller, action, method, name, namespace) {
  var eventName = `${namespace}controller:${underscoreName(name)}:${action}`;
  this.Dispatcher.on(eventName, controller[method], controller);
}

function registerControllerActions(controller, actions, name, namespace) {
  actions && actions.forEach((action) => {
    var method = action;
    if (_.isObject(action)) {
      method = _(action).values().first();
      action = _(action).keys().first();
    }
    ensureActionIsDefined(controller, action, method, name);
    registerControllerEvent.call(this, controller, action, method, name, namespace);
  }, this);
}

function registerApplicationControllerActions(controller, namespace) {
  if (!controller.init && !_.isFunction(controller.init)) {
    throw new Error("'Application' Controller: init is undefined");
  }
  var eventName = `${namespace}controller:all`;
  this.Dispatcher.on(eventName, controller.init, controller);
}

export default class Application {
  constructor() {
    this.Controllers = {};
    this.Dispatcher = Dispatcher;
  }

  createController(name, attributes) {
    var controller = createControllerInstance.call(this, attributes, name);
    var namespace = attributes.namespace ? `${attributes.namespace}:` : "";

    registerControllerActions.call(this, controller, attributes.actions, name, namespace);
    if (name.match(/^Application$/i)) {
      registerApplicationControllerActions.call(this, controller, namespace);
    }

    return this.Controllers[name] = controller;
  }
}
