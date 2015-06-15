var JSKit = (function() {
  if (!_) throw new Error("JSKit: lodash or underscore is required");
  if (!$) throw new Error("JSKit: jQuery or equivalent is required");

  return {
    createApplication: function() {
      return JSKit.Application.create();
    }
  };
})();
