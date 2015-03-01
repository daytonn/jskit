describe("Application", function() {
  var subject;
  var dispatcher;
  beforeEach(function() {
    subject = new JSKit.Application;
    dispatcher = new JSKit.Dispatcher;
  });

  it("has a Controllers namespace", function() {
    expect(subject.Controllers).to.be.an("Object");
  });

  it("has a Dispatcher", function() {
    expect(subject.Dispatcher.on).to.be.a("Function");
    expect(subject.Dispatcher.off).to.be.a("Function");
    expect(subject.Dispatcher.trigger).to.be.a("Function");
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
          index: sinon.spy()
        });
      });

      it("creates a controller instance on the App.Controller namespace", function() {
        expect(subject.Controllers.Test).to.be.an.instanceof(subject.TestController);
      });

      it("stores a reference to the constructor", function() {
        expect(subject.TestController).to.exist;
      });

      it("returns the controller", function() {
        expect(controller).to.be.an.instanceof(subject.TestController);
      });

      it("has the defined methods", function() {
        expect(controller.index).to.be.a("Function");
      });
    });

    describe("controller name", function() {
      it("constantizes underscored names", function() {
        controller = subject.createController("underscored_name", { dispatcher: dispatcher });

        expect(subject.Controllers.UnderscoredName).to.be.an.instanceof(subject.UnderscoredNameController);
        expect(subject.UnderscoredNameControllers).to.be.defined;
      });

      it("constantizes names with spaces", function() {
        controller = subject.createController("name with spaces", { dispatcher: dispatcher });
        expect(subject.Controllers.NameWithSpaces).to.be.an.instanceof(subject.NameWithSpacesController);
        expect(subject.NameWithSpacesControllers).to.be.defined;
      });

      it("constantizes names with dashes", function() {
        controller = subject.createController("dashed-name", { dispatcher: dispatcher });
        expect(subject.Controllers.DashedName).to.be.an.instanceof(subject.DashedNameController);
        expect(subject.DashedNameControllers).to.be.defined;
      });

      it("constantizes names with mixed characters", function() {
        controller = subject.createController("name with-mixed_characters", { dispatcher: dispatcher });
        expect(subject.Controllers.NameWithMixedCharacters).to.be.an.instanceof(subject.NameWithMixedCharactersController);
        expect(subject.NameWithMixedCharactersControllers).to.be.defined;
      });
    });
  });
});
