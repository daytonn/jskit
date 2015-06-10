describe("JSKit", function() {
  it("is an object", function() {
    expect(JSKit).to.be.an("Object");
  });

  describe("createApplication", function() {
    it("returns an Application object", function() {
      expect(JSKit.createApplication()).to.be.an("Object");
    });
  });
});
