import Dispatcher from "dispatcher"

import {
  // compact,
  each,
  first,
  // flatten,
  // functions,
  // includes,
  // last,
  // mapObject,
  // reduce,
  // unique
} from "list-comprehension"

import {
  // isFunction,
  // isString,
  isObject,
  extend,
  identity,
  requireArgument,
  snakeCase,
  uniqueId,
} from "utils"

const CONTROLLER_DEFAULTS = {
  all: identity,
  channel: "controller",
  elements: {},
  eventSeparator: ":",
  initialize: identity,
}

function createAttributes(options) {
  const { actions = [], name } = options
  const controllerActions = ["all", ...actions]

  return extend(options, {
    __actions__: normalizeActions(controllerActions, options),
    actions: controllerActions,
    eventNamespace: snakeCase(name)
  })
}

function ensureValidFunction(options, actionName, functionName) {
  requireArgument(options, "JSKit - Controller._ensureValidFunction(options, actionName, functionName) options is undefined but required")
  requireArgument(actionName, "JSKit - Controller._ensureValidFunction(options, actionName, functionName) actionName is undefined but required")
  requireArgument(functionName, "JSKit - Controller._ensureValidFunction(options, actionName, functionName) functionName is undefined but required")
  requireArgument(options[functionName], `JSKit - new Controller(props): there is no method "${functionName}" for action "${actionName}"`)

  return options[functionName]
}

function identifyFunction(fn) {
  requireArgument(fn, "JSKit - Controller._identifyFunction(fn): fn is undefined but required")

  fn.__jskitId__ = uniqueId()
  return fn
}

function isMultiMappedAction(action) {
  requireArgument(action, "JSKit - Controller._isMultiMappedAction(action): action is undefined but required")

  return isObject(action) && Object.keys(action).length > 1
}

function flattenMultiMappedAction(action) {
  requireArgument(action, "JSKit - Controller._flattenMultiMappedAction(action): action is undefined but required")

  return Object.keys(action).map(key => { return { [key]: action[key] } })
}

function flattenActions(actions) {
  requireArgument(actions, "JSKit - Controller._flattenActions(actions): actions is undefined but required")

  const newActions = actions.reduce((memo, action) => {
    if (isMultiMappedAction(action)) {
      return memo.concat(flattenMultiMappedAction(action))
    }
    return [action].concat(memo)
  }, [])

  return newActions
}

function normalizeActions(actions, options) {
  requireArgument(actions, "JSKit - Controller._normalizeActions(actions, options): actions is undefined but required")
  requireArgument(options, "JSKit - Controller._normalizeActions(actions, options): options is undefined but required")

  const flattenedActions = flattenActions(actions)

  return flattenedActions.reduce((memo, action) => {
    let functionName = action
    let actionName = action

    if (isObject(action)) {
      actionName = first(Object.keys(action))
      functionName = first(Object.values(action))
    }

    const actionFunction = ensureValidFunction(options, actionName, functionName)
    return extend(memo, { [actionName]: identifyFunction(actionFunction) })
  }, {})
}

function actionEventName(action, { channel, eventNamespace, eventSeparator }) {
  const sep = eventSeparator
  return `${channel}${sep}${eventNamespace}${sep}${action}`
}

function registerActions(dispatcher, { __actions__, channel, eventNamespace, eventSeparator }) {
  requireArgument(dispatcher, "JSKit - Controller._registerActions(dispatcher, attributes): dispatcher is undefined but required")
  requireArgument(__actions__, "JSKit - Controller._registerActions(dispatcher, attributes): attributes.__actions__ is undefined but required")

  each(__actions__, (handler, action) => {
    const eventName = actionEventName(action, { channel, eventNamespace, eventSeparator })
    dispatcher.on(eventName, handler)
  })
}

export default class Controller {
  constructor(props = {}) {
    requireArgument(props.name, "JSKit - new Controller(props): props.name is undefined but required")
    requireArgument(props.dispatcher, "JSKit - new Controller(props): props.dispatcher is undefined but required")
    const { dispatcher } = props
    delete props.dispatcher
    const options = extend(CONTROLLER_DEFAULTS, props)
    this.attributes = createAttributes(options)
    registerActions(dispatcher, this.attributes)
  }
}
