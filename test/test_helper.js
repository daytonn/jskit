var spies = [];
var stubs = [];

function spyOn(object, method) {
  var spy = sinon.spy(object, method);
  spies.push(spy);
  return spy;
}

function stub(object, method, retVal) {
  var stub = sinon.stub(object, method).returns(retVal);
  stubs.push(stub);
  return stub;
}

beforeEach(function() {
  spies = [];
  stubs = [];
  $("body").append("<div id='fixtures'/>");
});

afterEach(function() {
  _.each(spies, function(spy) {
    spy.restore();
  });

  _.each(stubs, function(stub) {
    stub.restore();
  });

  $("#fixtures").remove();
});
