/* jshint esnext: true */
import Application from "./application";

(global || window).JSKit = {
  createApplication() {
    return new Application;
  }
};
