/* jshint esnext: true */
import _ from "lodash";

class Controller {
  constructor() {
    _.bindAll.apply(this, [this].concat(_.functions(this)));
    this.actions = [];
    this.initialize();
  }

  initialize() {}
}

export default Controller;
