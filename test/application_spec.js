describe("Application", function() {
  var subject;

  beforeEach(function() {
    subject = JSkit.Application.create();
  });

  it("has a Controllers namespace", function() {
    expect(subject.Controllers).to.be.an("Object");
  });

  it("has a Dispatcher", function() {
    expect(subject.Dispatcher).to.be.an("Object");
  });

  describe("createController", function() {
    var controller;

    beforeEach(function() {
      controller = subject.createController("Test", {
        actions: ["index"],
        index: sinon.spy()
      });
    });

    it("requires a name", function() {
      expect(function() {
        subject.createController();
      }).to.throw("Application.createController(name, attrs): name is undefined");
    });

    it("creates a controller instance on the App.Controller namespace", function() {
      expect(controller).not.to.be.undefined;
    });

    it("adds the name to the attributes", function() {
      expect(controller.name).to.equal("Test");
    });

    it("adds the dispatcher to the attributes", function() {
      expect(controller.dispatcher).to.equal(subject.Dispatcher);
    });

    it("stores a reference to the factory", function() {
      expect(subject.TestController).to.exist;
    });

    it("returns the controller", function() {
      expect(controller).not.to.be.undefined;
    });

    it("has the defined methods", function() {
      expect(controller.index).to.be.a("Function");
    });

    describe("controller name", function() {
      it("constantizes underscored names", function() {
        controller = subject.createController("underscored_name");
        expect(subject.Controllers.UnderscoredName).to.be.defined;
        expect(subject.UnderscoredNameController).to.be.defined;
      });

      it("constantizes names with spaces", function() {
        controller = subject.createController("name with spaces");
        expect(subject.Controllers.NameWithSpaces).to.be.defined;
        expect(subject.NameWithSpacesController).to.be.defined;
      });

      it("constantizes names with dashes", function() {
        controller = subject.createController("dashed-name");
        expect(subject.Controllers.DashedName).to.be.defined;
        expect(subject.DashedNameController).to.be.defined;
      });

      it("constantizes names with mixed characters", function() {
        controller = subject.createController("name with-mixed_characters");
        expect(subject.Controllers.NameWithMixedCharacters).to.be.defined;
        expect(subject.NameWithMixedCharactersController).to.be.defined;
      });
    });

    describe("controller factories", function() {
      var factory;
      var controller;

      beforeEach(function() {
        controller = subject.createController("Test", {
          actions: ["index"],
          index: sinon.spy(),
          foo: "foo"
        });

        factory = subject.TestController;
      });

      it("does not force the application's dispatcher on the factory", function() {
        var factoryInstance = factory.create();
        expect(factoryInstance.dispatcher).not.to.equal(subject.Dispatcher);
      });

      it("allows defaults to be overriden", function() {
        var factoryInstance = factory.create({ foo: "bar" });
        expect(factoryInstance.foo).to.equal("bar");
      });
    });
  });
});
