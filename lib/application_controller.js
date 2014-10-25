/* jshint esnext: true */
import _ from "lodash";
import Controller from "./controller";

export default class ApplicationController extends Controller {
  constructor(dispatcher) {
    this.name = "";
    this.controllerName = "ApplicationController";
    this.actions = [{ all: "init" }];
    super(dispatcher);
  }

  init() {}
}
