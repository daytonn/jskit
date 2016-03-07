import Dispatcher from './dispatcher'
import Controller from './controller'
import { constantize } from './utils'

const createControllerFactory = (context, name, attrs) => {
  return (() => {
    const defaults = Object.assign({}, attrs, { name: name, dispatcher: context.Dispatcher })
    const controllerName = `${name}Controller`

    return context[controllerName] = context[controllerName] || {
      create(attrs) {
        return new Controller(Object.assign({}, attrs, defaults))
      }
    }
  })()
}

export default class Application {
  constructor() {
    this.Controllers = {}
    this.Dispatcher = Dispatcher
  }

  createController(name, attrs) {
    if (!name) throw new Error('Application.createController(name, attrs): name is undefined')
    const controllerName = constantize(name)
    const factory = createControllerFactory(this, controllerName, attrs)
    return this.Controllers[controllerName] = factory.create()
  }
}
