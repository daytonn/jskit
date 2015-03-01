var expect = chai.expect;
var spies = [];
var stubs = [];

function spyOn(object, method) {
  var spy =  sinon.spy(object, method);
  spies.push(spy);
  return spy;
}

function stub(object, method, returnValue) {
  var stub = sinon.stub(object. method, returnValue);
  stubs.push(stub);
  return stub;
}

function createController(dispatcher, attrs) {
  _.defaults(attrs || {}, { name: "Test" });
  function TestController() { JSKit.Controller.apply(this, arguments); }
  _.extend(TestController.prototype, JSKit.Controller.prototype, attrs);
  return new TestController(dispatcher);
}

afterEach(function() {
  _.each(spies, function(spy) {
    spy.restore();
  });

  _.each(stubs, function(stub) {
    stub.restore();
  });
});
