/* jshint esnext: true */
import { expect } from "./spec_helper";
import Controller from "../lib/controller";
import TestDispatcher from "../lib/test_dispatcher";
import Application from "../lib/application";
import Events from "backbone-events-standalone";

describe("Application", function() {
  var subject;
  var dispatcher;
  beforeEach(function() {
    subject = new Application;
    dispatcher = new TestDispatcher;
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
      controller = subject.createController("Test", { dispatcher: dispatcher });
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

      it("has the defined methods", () => {
        expect(controller.index).to.be.a.function;
      });
    });

    describe("controller name", function() {
      it("constantizes underscored names", function() {
        controller = subject.createController("underscored_name", { dispatcher: dispatcher });

        expect(subject.Controllers.UnderscoredName).to.be.an.instanceof(Controller);
        expect(subject.UnderscoredNameControllers).to.be.defined;
      });

      it("constantizes names with spaces", function() {
        controller = subject.createController("name with spaces", { dispatcher: dispatcher });
        expect(subject.Controllers.NameWithSpaces).to.be.an.instanceof(Controller);
        expect(subject.NameWithSpacesControllers).to.be.defined;
      });

      it("constantizes names with dashes", function() {
        controller = subject.createController("dashed-name", { dispatcher: dispatcher });
        expect(subject.Controllers.DashedName).to.be.an.instanceof(Controller);
        expect(subject.DashedNameControllers).to.be.defined;
      });

      it("constantizes names with mixed characters", function() {
        controller = subject.createController("name with-mixed_characters", { dispatcher: dispatcher });
        expect(subject.Controllers.NameWithMixedCharacters).to.be.an.instanceof(Controller);
        expect(subject.NameWithMixedCharactersControllers).to.be.defined;
      });
    });
  });
});
