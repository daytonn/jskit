var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var spies = [];
var stubs = [];

chai.use(sinonChai);

global.expect = chai.expect;

global.spyOn = function(object, method) {
  var spy = sinon.spy(object, method);
  spies.push(spy);
  return spy;
};

global.stub = function(object, method, retVal) {
  var stub = sinon.stub(object, method).returns(retVal);
  stubs.push(stub);
  return stub;
};
