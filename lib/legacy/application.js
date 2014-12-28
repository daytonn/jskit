var Events = require("backbone-events-standalone");
var _ = require("lodash");
var s = require("./string");
var BaseController = require("./controller");

var clone = _.clone;
var extend = _.extend;
var first = _.first;

function Application() {
  this.Controllers = {};
  this.Dispatcher = clone(Events);
}

Application.prototype.createController = function(name, attrs) {
  var dispatcher = attrs.dispatcher || this.Dispatcher;
  if (attrs.dispatcher) delete attrs.dispatcher;

  name = s.constantize(name);
  extend(attrs, { name: name });

  function Controller() { BaseController.apply(this, arguments); }
  extend(Controller.prototype, BaseController.prototype, attrs);
  this[attrs.name + "Controller"] = Controller;
  this.Controllers[name] = new Controller(dispatcher, attrs);

  return this.Controllers[name];
};

module.exports = Application;
