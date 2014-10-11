var def = require("./polyfill");
var _ = require("lodash");
/**
  Object which contains actions to be triggered by
  the global dispatcher.

  @class Controller
*/
function Controller() {
  this.initialize();
  _.bindAll.apply(this, [this].concat(_.functions(this)));
}

/**
  By default initialize commits no operation.
  This method is a post-instantiation hook
  that will be called to do any setup needed
  for the controller.

  @method initialize
*/
def(Controller, "initialize", function() {});

/**
  Array of methods on this controller that shoul
  fire when action events are triggered.

  @property actions
  @type {Array}
  @default []
*/
def(Controller, 'actions', [], true, true, true);

module.exports = Controller;
