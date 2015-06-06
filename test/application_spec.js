import Application from "../src/application";
import Dispatcher from "../src/dispatcher";

describe("Application", () => {
  let subject;
  let dispatcher;
  beforeEach(() => {
    subject = new Application;
    dispatcher = new Dispatcher;
  });

  it("has a Controllers namespace", () => {
    expect(subject.Controllers).to.be.an("Object");
  });

  it("has a Dispatcher", () => {
    expect(subject.Dispatcher).to.be.an.instanceof(Dispatcher);
  });

  // describe("createController", () => {
  //   let controller;

  //   it("accepts an alternate Dispatcher", () => {
  //     controller = subject.createController("Test", { dispatcher: dispatcher });
  //     expect(controller.dispatcher).to.equal(dispatcher);
  //   });

  //   describe("BaseController", () => {
  //     beforeEach(() => {
  //       controller = subject.createController("Test", {
  //         actions: ["index"],
  //         index: sinon.spy()
  //       });
  //     });

  //     it("creates a controller instance on the App.Controller namespace", () => {
  //       expect(subject.Controllers.Test).to.be.an.instanceof(subject.TestController);
  //     });

  //     it("stores a reference to the constructor", () => {
  //       expect(subject.TestController).to.exist;
  //     });

  //     it("returns the controller", () => {
  //       expect(controller).to.be.an.instanceof(subject.TestController);
  //     });

  //     it("has the defined methods", () => {
  //       expect(controller.index).to.be.a("Function");
  //     });
  //   });

  //   describe("controller name", () => {
  //     it("constantizes underscored names", () => {
  //       controller = subject.createController("underscored_name", { dispatcher: dispatcher });

  //       expect(subject.Controllers.UnderscoredName).to.be.an.instanceof(subject.UnderscoredNameController);
  //       expect(subject.UnderscoredNameControllers).to.be.defined;
  //     });

  //     it("constantizes names with spaces", () => {
  //       controller = subject.createController("name with spaces", { dispatcher: dispatcher });
  //       expect(subject.Controllers.NameWithSpaces).to.be.an.instanceof(subject.NameWithSpacesController);
  //       expect(subject.NameWithSpacesControllers).to.be.defined;
  //     });

  //     it("constantizes names with dashes", () => {
  //       controller = subject.createController("dashed-name", { dispatcher: dispatcher });
  //       expect(subject.Controllers.DashedName).to.be.an.instanceof(subject.DashedNameController);
  //       expect(subject.DashedNameControllers).to.be.defined;
  //     });

  //     it("constantizes names with mixed characters", () => {
  //       controller = subject.createController("name with-mixed_characters", { dispatcher: dispatcher });
  //       expect(subject.Controllers.NameWithMixedCharacters).to.be.an.instanceof(subject.NameWithMixedCharactersController);
  //       expect(subject.NameWithMixedCharactersControllers).to.be.defined;
  //     });
  //   });
  // });
});
