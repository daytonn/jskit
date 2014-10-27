/* jshint esnext: true */
import Events from "backbone-events-standalone";
import _ from "lodash";
import s from "./string";
import BaseController from "./controller";
import BaseApplicationController from "./application_controller";

export default class Application {
  constructor() {
    this.Controllers = {};
    this.Dispatcher = _.clone(Events);
  }

  createController(name, attributes={}, dispatcher) {
    dispatcher = dispatcher || this.Dispatcher;
    name = s.constantize(name);
    attributes = _.extend(attributes, { name: name });
    var controllerType = name.match(/^Application/) ? "Application" : "Base";
    this.Controllers[name] = this[`create${controllerType}Controller`](attributes, dispatcher);
    return this.Controllers[name];
  }

  createBaseController(attributes, dispatcher) {
    class Controller extends BaseController {}
    _.extend(Controller.prototype, attributes);
    this[`${attributes.name}Controller`] = Controller;
    return new Controller(dispatcher);
  }

  createApplicationController(attributes, dispatcher) {
    class ApplicationController extends BaseApplicationController {}
    _.extend(ApplicationController.prototype, attributes);
    this.ApplicationController = ApplicationController;
    return new ApplicationController(dispatcher);
  }
}
