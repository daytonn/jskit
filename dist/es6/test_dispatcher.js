/* jshint esnext: true */
import _ from "lodash";
import Events from "backbone-events-standalone";

function spyOn(handler) {
  handler.called = false;
  handler.callCount = 0;
  handler.calls = [];

  return handler;
}

function mapAction(action) {
  var name;
  var method;

  name = _.isString(action) ? action : _(action).keys().first();
  method = _.isString(action) ? action : _(action).values().first();

  return { name: name, method: method };
}

function actionName(action) {
  var actionMap = mapAction(action);
  return _.isString(action) ? `"${action}"` :  `{ ${actionMap.name}: "${actionMap.method}" }`;
}

class TestDispatcher {
  constructor() {
    this.events = {};
    this.shadowDispatcher = _.clone(Events);
  }

  on(eventName, handler, controller) {
    var spy = spyOn(handler);

    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(spy);

    this.shadowDispatcher.on(eventName, function() {
      this.trackSpy(spy);
    }, this);
  }

  trigger(eventName, handler, context) {
    this.shadowDispatcher.trigger(eventName, handler, context);
  }

  trackSpy(spy) {
    spy.callCount += 1;
    spy.called = true;
    spy.calls.push({ args: _.toArray(arguments) });
  }

  hasAction(controller, action) {
    var actionExists = false;

    controller.actions.forEach((a) => {
      if (actionName(a) === actionName(a)) actionExists = true;
    });

    if (!actionExists) return false;

    var actionMap = mapAction(action);
    var handler = controller[actionMap.method];

    var eventName = controller.actionEventName(actionMap.name);
    var cachedCount = handler.callCount;

    controller.dispatcher.trigger(eventName);

    return handler.callCount > cachedCount;
  }

  off() {}
}

export default TestDispatcher;
