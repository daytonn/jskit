/* jshint esnext: true */
import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import chaiJSKit from "./chai-jskit";
import Controller from "../lib/controller";
import TestDispatcher from "../lib/test_dispatcher";

var spies = [];
var stubs = [];

chai.use(sinonChai);
chai.use(chaiJSKit);

export var expect = chai.expect;

export function createController(dispatcher, attrs={}) {
  if (!attrs.name && attrs.name !== "") {
    attrs.name = "Test";
  }
  class TestController extends Controller {}
  var proto = TestController.prototype;
  for (var attr in attrs) {
    if (attrs.hasOwnProperty(attr)) proto[attr] = attrs[attr];
  }
  return new TestController(dispatcher);
}

export function createControllerWithMixins(dispatcher, attrs, ...mixins) {
  attrs = attrs || {};
  if (!attrs.name && attrs.name !== "") {
    attrs.name = "Test";
  }
  class TestController extends Controller {}
  var proto = TestController.prototype;
  for (var attr in attrs) {
    if (attrs.hasOwnProperty(attr)) proto[attr] = attrs[attr];
  }
  return new TestController(dispatcher, ...mixins);
}
