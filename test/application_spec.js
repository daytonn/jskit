import Application from "../src/application";

describe("Application", () => {
  let subject;

  beforeEach(() => {
    subject = Application.create();
  });

  it("has a Controllers namespace", () => {
    expect(subject.Controllers).to.be.an("Object");
  });

  it("has a Dispatcher", () => {
    expect(subject.Dispatcher).to.be.an("Object");
  });

  describe("createController", () => {
    let controller;

    beforeEach(() => {
      controller = subject.createController("Test", {
        actions: ["index"],
        index: sinon.spy()
      });
    });

    it("requires a name", () => {
      expect(() => {
        subject.createController();
      }).to.throw("Application.createController(name, attrs): name is undefined");
    });

    it("creates a controller instance on the App.Controller namespace", () => {
      expect(controller).not.to.be.undefined;
    });

    it("adds the name to the attributes", () => {
      expect(controller.name).to.equal("Test");
    });

    it("adds the dispatcher to the attributes", () => {
      expect(controller.dispatcher).to.equal(subject.Dispatcher);
    });

    it("stores a reference to the factory", () => {
      expect(subject.TestController).to.exist;
    });

    it("returns the controller", () => {
      expect(controller).not.to.be.undefined;
    });

    it("has the defined methods", () => {
      expect(controller.index).to.be.a("Function");
    });

    describe("controller name", () => {
      it("constantizes underscored names", () => {
        controller = subject.createController("underscored_name");
        expect(subject.Controllers.UnderscoredName).to.be.defined;
        expect(subject.UnderscoredNameController).to.be.defined;
      });

      it("constantizes names with spaces", () => {
        controller = subject.createController("name with spaces");
        expect(subject.Controllers.NameWithSpaces).to.be.defined;
        expect(subject.NameWithSpacesController).to.be.defined;
      });

      it("constantizes names with dashes", () => {
        controller = subject.createController("dashed-name");
        expect(subject.Controllers.DashedName).to.be.defined;
        expect(subject.DashedNameController).to.be.defined;
      });

      it("constantizes names with mixed characters", () => {
        controller = subject.createController("name with-mixed_characters");
        expect(subject.Controllers.NameWithMixedCharacters).to.be.defined;
        expect(subject.NameWithMixedCharactersController).to.be.defined;
      });
    });

    describe("controller factories", () => {
      let factory;
      let controller;

      beforeEach(() => {
        controller = subject.createController("Test", {
          actions: ["index"],
          index: sinon.spy(),
          foo: "foo"
        });

        factory = subject.TestController;
      });

      it("does not force the application's dispatcher on the factory", () => {
        let factoryInstance = factory.create();
        expect(factoryInstance.dispatcher).not.to.equal(subject.Dispatcher);
      });

      it("allows defaults to be overriden", () => {
        let factoryInstance = factory.create({ foo: "bar" });
        expect(factoryInstance.foo).to.equal("bar");
      });
    });
  });
});
