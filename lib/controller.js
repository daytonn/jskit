/* jshint esnext: true */
import _ from "lodash";
import s from "./string";

let bindAll = _.bindAll;
let compact = _.compact;
let defaults = _.defaults;
let each = _.each;
let extend = _.extend;
let first = _.first;
let functions = _.functions;
let isFunction = _.isFunction;
let isObject = _.isObject;
let keys = _.keys;
let uniq = _.uniq;
let values = _.values;

function ensureActionIsDefined(actionMap) {
  if (!isFunction(this[actionMap.method])) throw new Error(`${this.className} action "${actionMap.name}${this.eventSeperator}${actionMap.method}" method is undefined`);
}

function mapAction(action) {
  var isMappedAction = isObject(action);
  var method = isMappedAction ? first(values(action)) : action;
  var name = isMappedAction ? first(keys(action)) : action;

  return { name: name, method: method };
}

function registerActions(dispatcher) {
  each(this.actions, (action) => {
    var actionMap = mapAction(action);
    ensureActionIsDefined.call(this, actionMap);
    this.dispatcher.on(this.actionEventName(actionMap.name), this[actionMap.method], this);
  }, this);
}

function setControllerDefaults() {
  this.name = this.name || "Anonymous";
  defaults(this, {
    eventSeperator: ":",
    actions: [],
    channel: "controller",
    className: `${s.constantize(this.name)}Controller`,
    controllerEventName: s.underscore(this.name)
  });
}

function addMixins(mixins) {
  each(mixins, (mixin) => {
    if (mixin.actions) {
      this.actions = uniq(this.actions.concat(mixin.actions));
      delete mixin.actions;
    }
    extend(this, mixin, this);
  }, this);
}

class Controller {
  constructor(dispatcher, ...mixins) {
    if (!dispatcher) throw new Error(`${this.className}: dispatcher is undefined`);
    if (mixins) addMixins.call(this, mixins);
    this.dispatcher = dispatcher;
    bindAll.apply(this, [this].concat(functions(this)));

    setControllerDefaults.call(this);
    this.actions.unshift("all");
    registerActions.call(this);

    this.initialize();
  }

  initialize() {}
  all() {}
  actionEventName(action) {
    return compact([this.namespace, this.channel, this.controllerEventName, action]).join(this.eventSeperator);
  }
}

export default Controller;
