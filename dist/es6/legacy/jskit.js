var Application = require("./application");

global.JSKit = {
  createApplication: function() {
    return new Application;
  }
};
