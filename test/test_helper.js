(function() {
  var spies = [];
  var stubs = [];

  this.spyOn = function spyOn(object, method) {
    var spy = sinon.spy(object, method);
    spies.push(spy);
    return spy;
  }

  this.stub = function stub(object, method, retVal) {
    var stub = sinon.stub(object, method).returns(retVal);
    stubs.push(stub);
    return stub;
  }

  chai.Assertion.addMethod("action", function (action, methodName) {
    var assertMessage = "expected #{this} to have an " + action + " action mapped to the " + methodName + " method";
    var refuteMessage = "expected #{this} NOT to have an " + action + " action mapped to the " + methodName + " method";

    if (arguments.length == 1) {
      methodName = action;
      assertMessage = "expected #{this} to have an " + action + " action";
      refuteMessage = "expected #{this} to not have an " + action + " action";
    }

    this.assert(_.isFunction(this._obj[methodName]), assertMessage, refuteMessage);
  });

  beforeEach(function() {
    spies = [];
    stubs = [];

    $("body").append("<div id='fixtures'/>");
  });

  afterEach(function() {
    _.each(spies, function(spy) { spy.restore(); });
    _.each(stubs, function(stub) { stub.restore(); });

    $("#fixtures").remove();
  });
})();
