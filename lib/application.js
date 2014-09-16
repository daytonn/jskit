require('./polyfill');
var def = require('./polyfill');
var _ = require('lodash');
var BaseController = require('./controller');
var Dispatcher = require('backbone-events-standalone');

/**
  Application object which serves as a namespace
  and interface to create and interact with controllers.

  @class Application
*/
function Application() {
  /**
    Controllers namespace that contains
    controller instances.

    @property Controllers
    @type {Object}
    @default {}
  */
  this.Controllers = {};
  /**
    Global dispatcher to handle communication
    between components of the application.

    @property Dispatcher
  */
  this.Dispatcher = Dispatcher;
}

/**
  Create a new controller with the given attributes
  and return a new instance.

  @private
  @method createControllerInstance
  @param attributes {Object} Attributes to assign to the new Controller
  @return {Controller} new Controller instance
*/
function createControllerInstance(attributes) {
  function Controller() { BaseController.call(this); }
  Controller.prototype = Object.create(BaseController.prototype);
  Controller.prototype.constructor = Controller;
  _.extend(Controller.prototype, attributes);
  return new Controller;
}

/**
  Register each action with the Dispatcher.

  @private
  @method registerControllerActions
  @param controller {Controller} Controller whose actions you wish to register.
  @param actions {Array} Actions you wish to register.
  @param name {String} Name of the controller to namespace the event.
*/
function registerControllerActions(controller, actions, name, namespace) {
  _(actions).each(function(action) {
    if (!controller[action] || !_.isFunction(controller[action])) {
      throw new Error("'" + name + "' Controller has an action '" + action + "' defined with no corresponding method");
    }

    var eventName = _([namespace, 'controller', name.toLowerCase(), action]).compact().join(":");
    this.Dispatcher.on(eventName, controller[action], controller);
  }, this);
}

/**
  Create a new controller instance on the
  Controllers namespace with the given name
  and attributes. Register all the controller's
  actions with the Dispatcher.

  @method createController
  @param name {String} Name of the controller
  @return {Controller}
*/
def(Application, 'createController', function(name, attributes) {
  var controller = createControllerInstance(attributes);
  _.bindAll.apply(controller, [controller].concat(_.functions(controller)));
  registerControllerActions.call(this, controller, attributes.actions, name, attributes.namespace);
  return this.Controllers[name] = controller;
});

module.exports = Application;
