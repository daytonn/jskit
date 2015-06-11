JSKit.Application = (function() {
  var extend = _.extend;
  var map = _.map;

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
    create: function() {
      var dispatcher = JSKit.Dispatcher.create();
      return {
        Controllers: {},
        Dispatcher: dispatcher,

        createController: function(name, attrs) {
          attrs = attrs || {};
          if (!name) throw new Error("Application.createController(name, attrs): name is undefined");
          attrs.name = name;

          var factory = {
            create: function(attributes) {
              attributes = attributes || { name: name };
              return JSKit.Controller.create(extend({}, attrs, attributes));
            }
          };

          this[constantize(name) + "Controller"] = factory;
          this.Controllers[name] = factory.create({ dispatcher: dispatcher });

          return this.Controllers[name];
        }
      };
    }
  };
})();
