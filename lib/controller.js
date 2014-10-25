/* jshint esnext: true */
import Events from "backbone-events-standalone";
import _ from "lodash";
import s from "./string";

// private
function eventNamespace(action) {
  return _.compact([this.namespace, this.channel, this.name, action]).join(":");
}

function ensureActionIsDefined(actionMap) {
  if (!_.isFunction(this[actionMap.method])) throw new Error(`${this.controllerName} action "${actionMap.name}:${actionMap.method}" method is undefined`);
}

function mapAction(action) {
  var isMappedAction = _.isObject(action);
  var method = isMappedAction ? _(action).values().first() : action;
  var name = isMappedAction ? _(action).keys().first() : action;

  return { name: name, method: method };
}

function registerActions(Dispatcher) {
  _.each(this.actions, (action) => {
    var actionMap = mapAction(action);
    ensureActionIsDefined.call(this, actionMap);
    Dispatcher.on(eventNamespace.call(this, actionMap.name), this[actionMap.method]);
  }, this);
}

function setControllerDefaults() {
  this.actions = this.actions || [];
  this.channel = this.channel || "controller";
  this.controllerName = this.controllerName || `${s.constantize(this.name)}Controller`;
  this.name = s.underscore(this.name);
}

export default class Controller {
  constructor(Dispatcher) {
    _.bindAll.apply(this, [this].concat(_.functions(this)));
    setControllerDefaults.call(this);
    registerActions.call(this, Dispatcher || _.clone(Events));
    this.initialize();
  }

  initialize() {}
}
