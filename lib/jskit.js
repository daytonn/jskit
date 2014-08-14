var Application = require("./application");
/**
  Global object to interface with JSKit.

  @class JSKit
*/
global.JSKit = {
  /**
   Create a controller and wire up it's actions.

   @method createApplication
   @return {Application} Application object
  */
  createApplication: function() {
    return new Application;
  }
};
