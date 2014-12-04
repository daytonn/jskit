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

  createController(name, ...attrs) {
    var mixins = attrs.length > 2 ? attrs.slice(0, attrs.length -1) : [];
    attrs = _.first(attrs.slice(attrs.length -1)) || {};

    var dispatcher = attrs.dispatcher || this.Dispatcher;
    if (attrs.dispatcher) delete attrs.dispatcher;

    name = s.constantize(name);
    _.extend(attrs, { name: name });

    class Controller extends BaseController {}
    _.extend(Controller.prototype, attrs);
    this[`${attrs.name}Controller`] = Controller;
    this.Controllers[name] = new Controller(dispatcher, ...mixins);

    return this.Controllers[name];
  }
}
