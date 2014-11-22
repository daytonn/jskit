/* jshint esnext: true */
import Application from "./application";
import TestDispatcher from "./test_dispatcher";
import Controller from "./controller";

(global || window).JSKit = {
  TestDispatcher: TestDispatcher,
  Controller: Controller,
  createApplication() {
    return new Application;
  }
};
