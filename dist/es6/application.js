/* jshint esnext: true */
import Events from "backbone-events-standalone";
import _ from "lodash";
import s from "./string";
import BaseController from "./controller";

export default class Application {
  constructor() {
    this.Controllers = {};
    this.Dispatcher = _.clone(Events);
  }

  createController(name, attrs) {
    attrs = attrs || {};
    var dispatcher = attrs.dispatcher || this.Dispatcher;
    if (attrs.dispatcher) delete attrs.dispatcher;
    name = s.constantize(name);
    attrs = _.extend(attrs, { name: name });

    class Controller extends BaseController {}
    _.extend(Controller.prototype, attrs);
    this[`${attrs.name}Controller`] = Controller;
    this.Controllers[name] = new Controller(dispatcher);

    return this.Controllers[name];
  }
}
