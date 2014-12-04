/* jshint esnext: true */
import _ from "lodash";
import s from "./string";

function ensureActionIsDefined(actionMap) {
  if (!_.isFunction(this[actionMap.method])) throw new Error(`${this.className} action "${actionMap.name}${this.eventSeperator}${actionMap.method}" method is undefined`);
}

function mapAction(action) {
  var isMappedAction = _.isObject(action);
  var method = isMappedAction ? _(action).values().first() : action;
  var name = isMappedAction ? _(action).keys().first() : action;

  return { name: name, method: method };
}

function registerActions(dispatcher) {
  _.each(this.actions, (action) => {
    var actionMap = mapAction(action);
    ensureActionIsDefined.call(this, actionMap);
    this.dispatcher.on(this.actionEventName(actionMap.name), this[actionMap.method], this);
  }, this);
}

function setControllerDefaults() {
  this.name = this.name || "Anonymous";
  _.defaults(this, {
    eventSeperator: ":",
    actions: [],
    channel: "controller",
    className: `${s.constantize(this.name)}Controller`,
    controllerEventName: s.underscore(this.name)
  });
}

function addMixins(mixins) {
  _.each(mixins, (mixin) => {
    if (mixin.actions) {
      this.actions = _.uniq(this.actions.concat(mixin.actions));
      delete mixin.actions;
    }
    _.extend(this, mixin, this);
  }, this);
}

class Controller {
  constructor(dispatcher, ...mixins) {
    if (!dispatcher) throw new Error(`${this.className}: dispatcher is undefined`);
    if (mixins) addMixins.call(this, mixins);
    this.dispatcher = dispatcher;
    _.bindAll.apply(this, [this].concat(_.functions(this)));

    setControllerDefaults.call(this);
    this.actions.unshift("all");
    registerActions.call(this);

    this.initialize();
  }

  initialize() {}
  all() {}
  actionEventName(action) {
    return _.compact([this.namespace, this.channel, this.controllerEventName, action]).join(this.eventSeperator);
  }
}

export default Controller;
