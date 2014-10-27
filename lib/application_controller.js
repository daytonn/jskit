/* jshint esnext: true */
import _ from "lodash";
import Controller from "./controller";

export default class ApplicationController extends Controller {
  constructor(dispatcher) {
    this.name = "Application";
    this.controllerName = "ApplicationController";
    this.actions = [{ all: "init" }];
    super(dispatcher);
  }

  init() {}
}
