var _ = require("lodash");
var Events = require("backbone-events-standalone");

var clone = _.clone;
var contains = _.contains;
var each = _.each;
var first = _.first;
var functions = _.functions;
var isString = _.isString;
var keys = _.keys;
var toArray = _.toArray;
var values = _.values;
var map = _.map;
var rest = _.rest;

function spyOn(handler) {
  handler.called = false;
  handler.callCount = 0;
  handler.calls = [];
  return handler;
}

function mapAction(action) {
  var name;
  var method;

  name = isString(action) ? action : first(keys(action));
  method = isString(action) ? action : first(values(action));

  return { name: name, method: method };
}

function actionName(action) {
  var actionMap = mapAction(action);
  return isString(action) ? '"' + action + '"' :  '{ ' + actionMap.name + ': "' + actionMap.method + '" }';
}

function TestDispatcher() {
  this.listeners = [];
  this.events = {};
  this.shadowDispatcher = clone(Events);
}

TestDispatcher.prototype.on = function(eventName, handler, controller) {
  if (!contains(this.listeners, controller)) this.spyOnControllerMethods(controller);
  var spy = spyOn(handler);

  this.events[eventName] = this.events[eventName] || [];
  this.events[eventName].push(spy);

  this.shadowDispatcher.on(eventName, function() {
    this.trackSpy(spy, arguments);
  }, this);
};

TestDispatcher.prototype.spyOnControllerMethods = function(controller) {
  var actionNames = map(controller.actions, function(action) { return actionName(action); });
  var _this = this;
  each(functions(controller), function(method) {
    if (!contains(actionNames, method)) {
      var unboundMethod = controller[method];
      controller[method] = function() {
        _this.trackSpy(controller[method], arguments);
        return unboundMethod.apply(controller, arguments);
      };
      spyOn(controller[method]);
    }
  }, this);
  this.listeners.push(controller);
};

TestDispatcher.prototype.trigger = function(eventName, handler, context) {
  this.shadowDispatcher.trigger(eventName, handler, context);
};

TestDispatcher.prototype.trackSpy = function(spy, args) {
  spy.callCount += 1;
  spy.called = true;
  spy.calls.push({ args: toArray(args) });
};

TestDispatcher.prototype.hasAction = function(controller, action) {
  var actionExists = false;

  controller.actions.forEach(function(a) {
    if (actionName(a) === actionName(action)) actionExists = true;
  });

  if (!actionExists) return false;

  var actionMap = mapAction(action);
  var handler = controller[actionMap.method];

  var eventName = controller.actionEventName(actionMap.name);
  var cachedCount = handler.callCount;

  controller.dispatcher.trigger(eventName);

  return handler.callCount > cachedCount;
};

TestDispatcher.prototype.off = function() {};

module.exports = TestDispatcher;
