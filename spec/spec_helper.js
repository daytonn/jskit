/* jshint esnext: true */
import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

var spies = [];
var stubs = [];

chai.use(sinonChai);

export var expect = chai.expect;

export function spyOn(object, method) {
  var spy = sinon.spy(object, method);
  spies.push(spy);
  return spy;
}

export function stub(object, method, retVal) {
  var newStub = sinon.stub(object, method).returns(retVal);
  stubs.push(newStub);
  return stub;
}
