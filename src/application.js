import Dispatcher from "./dispatcher";

class Application {
  constructor() {
    this.Controllers = {};
    this.Dispatcher = new Dispatcher;
  }
}

export default Application;
