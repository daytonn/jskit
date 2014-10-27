/* jshint esnext: true */
export default function (chai, utils) {
  var Assertion = chai.Assertion;

  function isString(suspect) {
    return (utils.type(suspect) === "string");
  }

  function isObject(suspect) {
    return (utils.type(suspect) === "object");
  }

  function hasAction(controller, expectedAction) {
    if (!controller.dispatcher.events) throw new Error(`${controller.className} must use a TestDispatcher to use hasAction`);
    var actionExists = false;
    controller.actions.forEach((action) => {
      if (actionName(action) === actionName(expectedAction)) actionExists = true;
    });

    if (!actionExists) return false;

    var actionMap = mapAction(expectedAction);
    var handler = controller[actionMap.method];
    var eventName = controller.actionEventName(actionMap.name);
    var cachedCount = handler.callCount;

    controller.dispatcher.trigger(eventName);

    return handler.callCount > cachedCount;
  }

  function mapAction(action) {
    var name;
    var method;

    if (isString(action)) {
      name = action;
      method = action;
    } else if (isObject(action)) {
      for (var prop in action) {
        if (hasOwnProperty.call(action, prop)) {
          name = prop;
          method = action[prop];
        }
      }
    }

    return { name: name, method: method };
  }

  function actionName(action) {
    var actionMap = mapAction(action);
    return isString(action) ? `"${action}"` :  `{ ${actionMap.name}: "${actionMap.method}" }`;
  }

  utils.addChainableMethod(chai.Assertion.prototype, "action", function(expected) {
    var obj = this._obj;
    var expectedAction = actionName(expected);

    this.assert(
      hasAction(obj, expected),
      `expected ${obj.controllerName} to have action "${expectedAction}" in [${obj.actions.join(",")}]`,
      `expected ${obj.controllerName} not to have action "${expectedAction}" in [${obj.actions.join(",")}]`,
      expected
    );
  });
}
