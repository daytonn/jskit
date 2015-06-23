describe("JSkit", function() {
  it("is an object", function() {
    expect(JSkit).to.be.an("Object");
  });

  describe("createApplication", function() {
    it("returns an Application object", function() {
      expect(JSkit.createApplication()).to.be.an("Object");
    });
  });
});
