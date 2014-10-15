/* jshint esnext: true */
import { expect, spyOn, stub } from "./spec_helper";
import Controller from "../lib/controller";

describe("Controller", function() {
  var subject;
  beforeEach(function() {
    subject = new Controller;
  });

  it("exists", function() {
    expect(subject).to.be.an.instanceof(Controller);
  });

  it("has a default initialize method", function() {
    expect(subject.initialize).to.be.a("function");
  });

  it("has a default actions array", function() {
    expect(subject.actions).to.be.an("array");
  });
});
