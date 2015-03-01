describe("API", function() {
  var subject;

  describe("createApplication", function() {
    beforeEach(function() {
      subject = JSKit.createApplication();
    });

    it("creates an application", function() {
      expect(subject).to.be.an.instanceof(JSKit.Application);
    });
  });
});
