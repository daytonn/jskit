var _ = require("lodash");

function Controller() {
  this.initialize();
  _.bindAll.apply(this, [this].concat(_.functions(this)));
}

Controller.prototype.initialize = function() {};

Controller.prototype.actions = [];

module.exports = Controller;
