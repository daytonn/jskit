/* jshint esnext: true */
import _ from "lodash";
import def from "./def";

class Controller {
  constructor() {
    _.bindAll.apply(this, [this].concat(_.functions(this)));
    this.actions = [];
    this.initialize();
  }

  initialize() {}
}

export default Controller;
