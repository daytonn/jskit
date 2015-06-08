import Dispatcher from "./dispatcher";
import Controller from "./controller";

let extend = _.extend;
let map = _.map;

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

let Application = {
  create() {
    return {
      Controllers: {},
      Dispatcher: Dispatcher.create(),

      createController(name, attrs={}) {
        if (!name) throw new Error("Application.createController(name, attrs): name is undefined");
        attrs.name = name;

        let factory = {
          create(attributes={ name: name }) {
            return Controller.create(extend({}, attrs, attributes));
          }
        }
        this[`${constantize(name)}Controller`] = factory;
        return this.Controllers[name] = factory.create({ dispatcher: this.Dispatcher });
      }
    };
  }
};

export default Application;
