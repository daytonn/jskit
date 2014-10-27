/* jshint esnext: true */
import { expect } from "./spec_helper";
import globals from "../lib/jskit";
import TestDispatcher from "../lib/test_dispatcher";
import Application from "../lib/application";

describe("JSKit", () => {
  var subject;
  beforeEach(() => {
    subject = JSKit;
  });

  it("has a TestDispatcher class", function() {
    var dispatcher = new subject.TestDispatcher;
    expect(dispatcher.events).to.be.an("Object");
    expect(dispatcher.on).to.be.a("Function");
    expect(dispatcher.off).to.be.a("Function");
    expect(dispatcher.trigger).to.be.a("Function");
  });

  describe("createApplication", () => {
    var app;
    beforeEach(() => {
      app = subject.createApplication();
    });

    it("creates an application", () => {
      expect(app).to.be.an.instanceof(Application);
    });
  });
});
