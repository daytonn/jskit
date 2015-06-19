/**
 * JSKit global namespace object
 *
 * @module JSKit
 * @class JSKit
*/
var JSKit = (function() {
  if (!_) throw new Error("JSKit: lodash or underscore is required");
  if (!$) throw new Error("JSKit: jQuery or equivalent is required");

  return {
    /**
     * Returns a new Application object.
     *
     * @method createApplication
     * @return {Application}
    */
    createApplication: function() {
      return JSKit.Application.create();
    }
  };
})();
