/**
 * JSkit global namespace object
 *
 * @module JSkit
 * @class JSkit
*/
var JSkit = (function() {
  if (!_) throw new Error("JSkit: lodash or underscore is required");

  return {
    /**
     * Returns a new Application object.
     *
     * @static
     * @method createApplication
     * @return {Application}
    */
    createApplication: function() {
      return JSkit.Application.create();
    }
  };
})();
