/* jshint esnext: true */
import _ from "lodash";
import def from "./def";

function Controller() {
  this.initialize();
  _.bindAll.apply(this, [this].concat(_.functions(this)));
}

def(Controller, "initialize", function() {});
def(Controller, "actions", [], true, true, true);

export default Controller;

