/* jshint esnext: true */
import Application from "./application";

(global || window).JSKit = {
  createApplication: function() {
    return new Application;
  }
};
