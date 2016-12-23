export function isUndefined(suspect) {
  return typeof suspect === 'undefined' || suspect === null
}

export function isDefined(suspect) {
  return !isUndefined(suspect)
}

export function isArray(suspect) {
  return suspect instanceof Array
}

export function isFunction(suspect) {
  return typeof suspect === 'function'
}

export function isEmpty(suspect) {
  requireArgument(suspect, 'isEmpty(suspect): suspect is undefined')
  let value = isObject(suspect) ? Object.keys(suspect) : suspect

  return !value.length
}

export function isNotEmpty(suspect) {
  requireArgument(suspect, 'isNotEmpty(suspect): suspect is undefined')

  return !isEmpty(suspect)
}

export function isNumber(suspect) {
  return typeof suspect === 'number'
}

export function isString(suspect) {
  return typeof suspect === 'string'
}

export function isObject(suspect) {
  return typeof suspect === 'object'
}

export function requireArgument(argument, message) {
  if (isUndefined(message)) throw new Error('requireArgument(argument, message): message is undefined')
  if (isUndefined(argument)) throw new Error(message)
}

export function requireCondition(condition, message) {
  requireArgument(message, 'requireCondition(condition, message): message is undefined')
  if (!condition) throw new Error(message)
}

export function toArray(v) {
  requireArgument(v, 'toArray(value): value is undefined')

  return Array.prototype.slice.apply(v)
}

export function objectsAreEqual(objectA, objectB) {
  requireArgument(objectA, 'objectsAreEqual(objectA, objectB): objectA is undefined')
  requireArgument(objectB, 'objectsAreEqual(objectA, objectB): objectB is undefined')

  return Object.keys(objectA).reduce((accumulator, key) => {
    let objectIsEqual = accumulator
    if (objectIsEqual) objectIsEqual = objectA[key] == objectB[key] // eslint-disable-line eqeqeq

    return objectIsEqual
  }, true)
}

export function snakeCase(string) {
  return string.toLowerCase().replace(/(-|\s{1,})/g, '_')
}

export function isNull(suspect) {
  return suspect === null
}

export function uniqueId() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000) // eslint-disable-line no-magic-numbers
      .toString(16) // eslint-disable-line no-magic-numbers
      .substring(1)
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
}

export function value(v) {
  return isFunction(v) ? v() : v
}

export function identity(v) {
  return v
}

export function clone(object) {
  return JSON.parse(JSON.stringify(object))
}

export function extend(destination, ...sources) {
  return Object.assign({}, ...[destination, ...sources])
}
