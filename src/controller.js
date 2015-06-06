import Dispatcher from "./dispatcher";

let bindAll = _.bindAll;
let compact = _.compact;
let map = _.map;
let defaults = _.defaults;
let each = _.each;
let assign = _.assign;
let first = _.first;
let functions = _.functions;
let isFunction = _.isFunction;
let isObject = _.isObject;
let keys = _.keys;
let uniq = _.uniq;
let values = _.values;

function underscore(string) {
  string = string || "";
  return string.replace(/([A-Z])/g, " $1").replace(/^\s?/, "").replace(/-|\s/g, "_").toLowerCase();
}

function actionEventName(controller, action) {
  return compact([
    controller.namespace,
    controller.channel,
    controller.controllerEventName,
    action
  ]).join(this.eventSeparator);
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

    return controller;
  }
};

export default Controller;
