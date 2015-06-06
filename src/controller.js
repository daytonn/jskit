import Dispatcher from "./dispatcher";

let bindAll = _.bindAll;
let compact = _.compact;
let defaults = _.defaults;
let each = _.each;
let first = _.first;
let functions = _.functions;
let isFunc = _.isFunction;
let isObject = _.isObject;
let keys = _.keys;
let uniq = _.uniq;
let values = _.values;

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
    throw new Error(controller.name + " action \"" + actionMap.name + ":" + actionMap.method + "\" method is undefined");
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

let Controller = {
  create(attrs={}) {
    if (!attrs.name) throw new Error("Controller.create(name): name is undefined");

    var controller = defaults(attrs, {
      actions: [],
      channel: "controller",
      controllerEventName: underscore(attrs.name),
      dispatcher: new Dispatcher,
      eventSeparator: ":",
      all: () => {},
      initialize: () => {}
    });

    bindAll(controller);
    controller.actions.unshift("all");
    registerActions(controller);
    controller.initialize();

    return controller;
  }
};

export default Controller;
