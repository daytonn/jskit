beforeEach(() => {
  var $mocha = $("#mocha");
  $mocha.append("<div id='fixtures'/>");
});

afterEach(function() {
  $("#fixtures").remove();
});
