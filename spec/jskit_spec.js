/* jshint esnext: true */
import { expect, spyOn, stub } from "./spec_helper";
import globals from "../lib/jskit";
import Application from "../lib/application";

describe("JSKit", function() {
  var subject;
  beforeEach(function() {
    subject = JSKit;
  });

  describe("createApplication", function() {
    var app;
    beforeEach(function() {
      app = subject.createApplication();
    });

    it("creates an application", function() {
      expect(app).to.be.an.instanceof(Application);
    });
  });
});
