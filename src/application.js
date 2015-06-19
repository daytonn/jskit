/**
 * @module JSKit
 * @class Application
*/
JSKit.Application = (function() {
  var extend = _.extend;
  var map = _.map;

  /**
   * Takes a string and creates a constant name
   * by uppercasing and camel-casing each word
   * delimited by a space.
   *
   * @private
   * @method constantize
   * @param {String} [string=""]
   * @return {String}
  */
  function constantize(string) {
    string = string || "";
    if (string.match(/_|-|\s/)) {
      var s = map(string.split(/_|-|\s/g), function(part, i) {
        return (i > 0) ? part.charAt(0).toUpperCase() + part.slice(1) : part.toLowerCase();
      }).join("");
      string = s;
    } else {
      string = string.toString();
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return {
    /**
     * Creates a new application object.
     *
     * @method create
     * @static
     * @return {Object} Application object
    */
    create: function() {
      var dispatcher = JSKit.Dispatcher.create();
      return {
        /**
         * Controllers namespace to store Controller objects built at runtime
         *
         * @property Controllers
         * @type Object
         * @default {}
        */
        Controllers: {},
        /**
         * Dispatcher to subcribe and publish events
         *
         * @property Dispatcher
         * @type Dispatcher
         * @default Dispatcher
        */
        Dispatcher: dispatcher,
        /**
         * Creates a controller with the given name and attributes
         * and returns it. It also saves a reference to the Controller
         * factory used to create the controller for testing purposes.
         *
         * @method createController
         * @param {String} name Name of the controller
         * @param {Object} [attributes={}] Controller attributes
         * @return {Controller}
        */
        createController: function(name, attrs) {
          attrs = attrs || {};
          if (!name) throw new Error("Application.createController(name, attrs): name is undefined");
          attrs.name = name;
          var controllerName = constantize(name) + "Controller";
          /**
           * @class ControllerFactory
          */
          var factory = this[controllerName] = {
            /**
             * Creates a fresh controller object with the original defaults
             *
             * @static
             * @method create
             * @param {Object} [attributes]
             * @return {Controller}
            */
            create: function(attributes) {
              attributes = attributes || { name: name };
              return JSKit.Controller.create(extend({}, attrs, attributes));
            }
          };

          this.Controllers[name] = factory.create({ dispatcher: dispatcher });

          return this.Controllers[name];
        }
      };
    }
  };
})();
