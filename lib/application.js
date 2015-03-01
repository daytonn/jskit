JSKit.Application = (function() {
  var clone = _.clone;
  var assign = _.assign;
  var first = _.first;
  var map = _.map;

  function Application() {
    this.Controllers = {};
    this.Dispatcher = new JSKit.Dispatcher;
  }

  Application.prototype.createController = function(name, attrs) {
    var dispatcher = attrs.dispatcher || this.Dispatcher;
    if (attrs.dispatcher) delete attrs.dispatcher;

    name = constantize(name);
    assign(attrs, { name: name });

    function Controller() { JSKit.Controller.apply(this, arguments); }
    assign(Controller.prototype, JSKit.Controller.prototype, attrs);
    this[attrs.name + "Controller"] = Controller;
    this.Controllers[name] = new Controller(dispatcher, attrs);

    return this.Controllers[name];
  };

  return Application;

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

})();
