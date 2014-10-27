/* jshint esnext: true */
import { expect, createController } from "./spec_helper";
import Controller from "../lib/controller";
import TestDispatcher from "../lib/test_dispatcher";
import Events from "backbone-events-standalone";
import _ from "lodash";

describe("Chai JSKit", function() {
  var controller;
  var controllerDefaults;
  var dispatcher;
  class TestController extends Controller {}

  beforeEach(function() {
    controllerDefaults = {
      actions: ["index", { foo: "index" }],

      index: function() {}
    };
    var dispatcher = new TestDispatcher;
    controller = createController(dispatcher, controllerDefaults);
  });

  describe("action", function() {
    it("throws an error when you don't use a TestDispatcher", function() {
      controller = createController(_.clone(Events));
      expect(() => {
        expect(controller).to.have.action("index");
      }).to.throw("TestController must use a TestDispatcher to use hasAction");
    });

    it("returns true if triggering an action increases the callCount", function() {
      expect(controller).to.have.action("index");
    });

    it("returns false if triggering an action does not increase the callCount", function() {
      expect(controller).not.to.have.action("nonexistent");
    });

    describe("mapped actions", function() {
      it("returns true if triggering an action increases the callCount", function() {
        expect(controller).to.have.action({ foo: "index" });
      });

      it("returns false if triggering an action does not increase the callCount", function() {
        expect(controller).not.to.have.action({ nonexistent: "index" });
      });
    });
  });
});
