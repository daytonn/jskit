import {
  isArray,
  isDefined,
  isObject,
  objectsAreEqual,
  requireArgument,
  isFunction,
  requireCondition,
} from './utils'

export function contains(list, suspect) {
  requireArgument(list, 'contains(list, suspect): list is undefined but required')
  requireArgument(suspect, 'contains(list, suspect): suspect is undefined but required')

  return reduce(list, (accumulator, item) => {
    let containsItem = accumulator
    if (!containsItem) {
      if (isObject(suspect)) {
        containsItem = objectsAreEqual(suspect, item)
      } else {
        containsItem = item == suspect // eslint-disable-line eqeqeq
      }
    }

    return containsItem // eslint-disable-line newline-before-return
  }, false)
}

export function compact(list) {
  requireArgument(list, 'compact(list): list is undefined but required')

  return reduce(list, (accumulator, item) => {
    if (isDefined(item)) {
      accumulator.push(item)
    }

    return accumulator
  }, [])
}

export function filter(list, iterator) {
  requireArgument(list, 'filter(list, iterator): list is undefined but required')
  requireCondition(isArray(list), 'filter(list, iterator): list is not an Array but should be')
  requireArgument(iterator, 'filter(list, iterator): iterator is undefined but required')
  requireCondition(typeof iterator === 'function', 'filter(list, iterator): iterator is not a function but should be')

  return reduce(list, (accumulator, item) => {
    if (iterator(item)) accumulator.push(item)

    return accumulator
  }, [])
}

export function reduce(collection, iterator, accumulator) {
  requireArgument(collection, 'reduce(collection, iterator, accumulator): collection is undefined but required')
  requireArgument(iterator, 'reduce(collection, iterator, accumulator): iterator is undefined but required')
  requireCondition(typeof iterator === 'function', 'reduce(collection, iterator, accumulator): iterator is not a function but should be')

  let returnValue = accumulator

  if (isArray(collection)) {
    let list = collection
    list.forEach(item => {
      returnValue = iterator(returnValue, item)
    })
  } else {
    const object = collection
    Object.keys(object).forEach(key => {
      const value = object[key]
      returnValue = iterator.call(object, value, key, object)
    })
  }

  return returnValue
}

export function reject(list, iterator) {
  requireArgument(list, 'reject(list, iterator): list is undefined but required')
  requireCondition(isArray(list), 'reject(list, iterator): list is not an Array but should be')
  requireArgument(iterator, 'reject(list, iterator): iterator is undefined but required')
  requireCondition(typeof iterator === 'function', 'reject(list, iterator): iterator is not a function but should be')

  return reduce(list, (accumulator, item) => {
    if (!iterator(item)) accumulator.push(item)

    return accumulator
  }, [])
}

export function head(list) {
  requireArgument(list, 'tail(list): list is undefined but required')

  return first(list)
}

export function tail(list) {
  requireArgument(list, 'tail(list): list is undefined but required')
  const [, ...rest] = list

  return rest
}

export function some(list, iterator) {
  requireArgument(list, 'some(list, iterator): list is undefined but required')
  requireArgument(iterator, 'some(list, iterator): iterator is undefined but required')

  return list.reduce((memo, item) => {
    if (!memo) return iterator(item)
    return memo
  }, false)
}

export function none(list, iterator) {
  requireArgument(list, 'none(list, iterator): list is undefined but required')
  requireArgument(iterator, 'none(list, iterator): iterator is undefined but required')

  return list.reduce((memo, item) => {
    if (memo) return !iterator(item)
    return memo
  }, true)
}

export function any(list) {
  return some.apply(list, arguments)
}

export function first(list) {
  requireArgument(list, 'first(list): list is undefined but required')

  let nothing
  return list.length ? list[0] : nothing
}

export function last(list) {
  requireArgument(list, 'last(list): list is undefined but required')

  let nothing
  return list.length ? list.reverse()[0] : nothing
}

export function each(collection, iterator) {
  requireArgument(collection, 'each(collection, iterator): collection is undefined but required')
  requireArgument(iterator, 'each(collection, iterator): iterator is undefined but required')

  if (isArray(collection)) {
    const list = collection
    list.forEach(iterator)
  } else {
    const object = collection
    Object.keys(object).forEach(key => {
      const value = object[key]
      iterator.call(object, value, key, object)
    })
  }
}

export function includes(list, value) {
  requireArgument(list, 'includes(list, value): list is undefined but required')

  return some(list, item => item === value)
}

export function excludes(list, value) {
  requireArgument(list, 'excludes(list, value): list is undefined but required')

  return !includes(list, value)
}

export function flatten(list) {
  requireArgument(list, 'flatten(list): list is undefined but required')

  return list.reduce((memo, item) => {
    isArray(item) ? memo.push(...flatten(item)) : memo.push(item)
    return memo
  }, [])
}

export function mapObject(object, iterator) {
  requireArgument(object, 'mapObject(object, iterator): object is undefined but required')
  requireArgument(iterator, 'mapObject(object, iterator): iterator is undefined but required')

  return Object.keys(object).map(key => iterator(object[key], key))
}

export function functions(collection) {
  requireArgument(collection, 'functions(collection): collection is undefined but required')

  if (isArray(collection)) {
    const list = collection
    return filter(list, item => isFunction(item))
  }

  const object = collection

  return Object.keys(object).reduce((memo, key) => {
    if (typeof object[key] === 'function') memo.push(key)
    return memo
  }, [])
}

export function unique(list) {
  requireArgument(list, 'unique(list): list is undefined but required')

  return list.reduce((memo, value) => {
    return includes(memo, value) ? memo : [...memo, value]
  }, [])
}
