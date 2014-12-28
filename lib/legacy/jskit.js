var Application = require("./application");
var TestDispatcher = require("./test_dispatcher");

(global || window).JSKit = {
  TestDispatcher: TestDispatcher,
  createApplication: function() {
    return new Application;
  }
};
