/* jshint esnext: true */
import { expect } from "./spec_helper";
import Controller from "../lib/controller";
import ApplicationController from "../lib/application_controller";
import TestDispatcher from "../lib/test_dispatcher";
import Application from "../lib/application";
import Events from "backbone-events-standalone";
import _ from "lodash";

describe("Application", function() {
  var subject;
  beforeEach(function() {
    subject = new Application;
  });

  it("has a Controllers namespace", () => {
    expect(subject.Controllers).to.be.an("object");
  });

  it("has a Dispatcher", () => {
    expect(subject.Dispatcher.on).to.be.a("function");
    expect(subject.Dispatcher.off).to.be.a("function");
    expect(subject.Dispatcher.trigger).to.be.a("function");
    expect(subject.Dispatcher.once).to.be.a("function");
    expect(subject.Dispatcher.listenTo).to.be.a("function");
    expect(subject.Dispatcher.stopListening).to.be.a("function");
    expect(subject.Dispatcher.listenToOnce).to.be.a("function");
  });

  describe("createController", function() {
    var controller;

    it("accepts an alternate Dispatcher", function() {
      var dispatcher = new TestDispatcher;
      controller = subject.createController("Test", {}, dispatcher);
      expect(controller.dispatcher).to.equal(dispatcher);
    });

    describe("BaseController", function() {
      beforeEach(function() {
        controller = subject.createController("Test", {
          actions: ["index"],
          index: function() { this.indexCalled = true; }
        });
      });

      it("creates a controller instance on the Controler's namespace", () => {
        expect(subject.Controllers.Test).to.be.an.instanceof(Controller);
      });

      it("returns the controller", () => {
        expect(controller).to.be.an.instanceof(Controller);
      });
    });

    describe("ApplicationController", function() {
      beforeEach(function() {
        controller = subject.createController("Application", {
          init: function() { this.initCalled = true; }
        });
      });

      it("creates a controller instance on the Controler's namespace", () => {
        expect(subject.Controllers.Application).to.be.an.instanceof(ApplicationController);
      });

      it("returns the controller", () => {
        expect(controller).to.be.an.instanceof(ApplicationController);
      });
    });

    describe("constantizing controller name", function() {
      it("constantizes underscored names", function() {
        controller = subject.createController("underscored_name");
        expect(subject.Controllers.UnderscoredName).to.be.an.instanceof(Controller);
        expect(subject.UnderscoredNameControllers).to.be.defined;
      });

      it("constantizes names with spaces", function() {
        controller = subject.createController("name with spaces");
        expect(subject.Controllers.NameWithSpaces).to.be.an.instanceof(Controller);
        expect(subject.NameWithSpacesControllers).to.be.defined;
      });

      it("constantizes names with dashes", function() {
        controller = subject.createController("dashed-name");
        expect(subject.Controllers.DashedName).to.be.an.instanceof(Controller);
        expect(subject.DashedNameControllers).to.be.defined;
      });

      it("constantizes names with mized characters", function() {
        controller = subject.createController("name with-mixed_characters");
        expect(subject.Controllers.NameWithMixedCharacters).to.be.an.instanceof(Controller);
        expect(subject.NameWithMixedCharactersControllers).to.be.defined;
      });
    });
  });
});
