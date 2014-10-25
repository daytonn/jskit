/* jshint esnext: true */
import { expect, spyOn, stub } from "./spec_helper";
import ApplicationController from "../lib/application_controller";
import Events from "backbone-events-standalone";
import _ from "lodash";

describe("ApplicationController", () => {
  var Dispatcher;
  var initCalled;
  var subject;

  beforeEach(function() {
    initCalled = false;
    Dispatcher = Events;
    class TestController extends ApplicationController {
      init() {
        initCalled = true;
      }
    }
    subject = new TestController(Dispatcher);
  });

  it("wires init to the controller:all event", () => {
    Dispatcher.trigger("controller:all");
    expect(initCalled).to.equal(true);
  });

  it("has a default init method", function() {
    class TestController extends ApplicationController {}
    subject = new TestController;
    expect(subject.init).to.be.a("Function");
  });

  it("has a controllerName", function() {
    expect(subject.controllerName).to.equal("ApplicationController");
  });
});
