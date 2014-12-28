var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var Controller = require("../../lib/legacy/controller");
var spies = [];
var stubs = [];

chai.use(sinonChai);

global._ = require("lodash");
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

global.createController = function(dispatcher, attrs) {
  attrs = attrs || {};
  if (!attrs.name && attrs.name !== "") {
    attrs.name = "Test";
  }
  function TestController() { Controller.apply(this, arguments); }
  _.extend(TestController.prototype, Controller.prototype, attrs);
  var proto = TestController.prototype;
  for (var attr in attrs) {
    if (attrs.hasOwnProperty(attr)) proto[attr] = attrs[attr];
  }
  return new TestController(dispatcher);
};

