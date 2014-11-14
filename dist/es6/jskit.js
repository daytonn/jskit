/* jshint esnext: true */
import Application from "./application";
import TestDispatcher from "./test_dispatcher";

(global || window).JSKit = {
  TestDispatcher: TestDispatcher,
  createApplication() {
    return new Application;
  }
};
