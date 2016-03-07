export const each = (collection, iterator) => {
  return function() {
    return Array.prototype.forEach.call(collection, iterator)
  }
}

export const map = (collection, callback, context) => {
  if (!collection) throw new TypeError('map(collection, callback, thisArg): collection is null or not defined')
  if (typeof callback !== 'function') throw new TypeError(callback + 'map(collection, callback, thisArg): callback is not a function')

  const collectionClone = Object(collection)
  const length = collectionClone.length >>> 0
  const accumulator = new Array(length)

  let i = 0
  while (i < length) {
    if (i in collectionClone) {
      let mappedValue = callback.call(context, collectionClone[i], i, collectionClone)
      accumulator[i] = mappedValue
    }
    i += 1
  }
  return accumulator
}

export const reduce = (collection, callback, accumulator, context) => {
  if (!collection) throw new TypeError('reduce(collection, callback, memo): collection is undefined')
  if (!isFunction(callback)) throw new TypeError('reduce(collection, callback, memo): is not a function')

  const list = Object(collection)
  const length = list.length >>> 0

  let i = 0
  if (accumulator) {
    accumulator = arguments[1]
  } else {
    while (i < length && !(i in list)) { i++ }
    if (i >= length) throw new TypeError('Reduce of empty array with no initial value')
    accumulator = list[i++]
  }

  for (; i < length; i++) {
    if (i in list) {
      accumulator = callback(accumulator, list[i], i, list)
    }
  }
  return accumulator
}

export const constantize = (string='') => {
  if (string.match(/_|-|\s/)) {
    const s = map(string.split(/_|-|\s/g), function(part, i) {
      return (i > 0) ? part.charAt(0).toUpperCase() + part.slice(1) : part.toLowerCase()
    }).join('')
    string = s
  } else {
    string = string.toString()
  }
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function arraySome(collection, predicate) {
  let index = -1
  const length = collection.length

  while (++index < length) {
    if (predicate(collection[index], index, collection)) return true
  }

  return false
}

function objSome(collection, predicate) {
  for (const key in collection) {
    if (predicate(collection[key], key, collection)) return true
  }

  return false
}

export const isObject = (suspect) => {
  var type = typeof suspect
  return !!suspect && (type == 'object' || type == 'function')
}

export const some = (collection, predicate) => {
  return isObject(collection) ? objSome(collection, predicate) : arraySome(collection, predicate)
}

export const tail = (collection) => {
  return Array.prototype.slice.call(collection, 1)
}

export const first = (collection) => {
  return collection[0]
}

export const none = (collection, predicate) => {
  return !some(collection, predicate)
}

export const any = some

export const isFunction = (suspect) => !!(typeof suspect == 'function')

export const functions = (obj) => {
  let names = []
  Object.keys(obj).forEach((name) => {
    if (isFunction(obj[name])) names.push(name)
  })
  return names
}

export const bind = (context, fn) => {
  return () => fn.apply(context, arguments)
}
