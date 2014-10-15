/* jshint esnext: true */
import { expect, spyOn, stub } from "./spec_helper";
import globals from "../lib/jskit";
import Application from "../lib/application";

describe("JSKit", () => {
  var subject;
  beforeEach(() => {
    subject = JSKit;
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
