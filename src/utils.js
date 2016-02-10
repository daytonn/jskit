export function map(collection, callback, thisArg) {
  if (!collection) throw new TypeError(' this is null or not defined')
  const O = Object(collection)
  const len = O.length >>> 0
  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function')
  const T = thisArg
  const A = new Array(len)
  let k = 0
  while (k < len) {
    let kValue, mappedValue
    if (k in O) {
      kValue = O[k]
      mappedValue = callback.call(T, kValue, k, O)
      A[k] = mappedValue
    }
    k++
  }
  return A
}

export function reduce(collection, callback, value) {
  if (!collection) throw new TypeError('Array.prototype.reduce called on null or undefined')
  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function')
  const t = Object(collection)
  const len = t.length >>> 0
  let k = 0

  if (value) {
    value = arguments[1]
  } else {
    while (k < len && !(k in t)) { k++ }
    if (k >= len) throw new TypeError('Reduce of empty array with no initial value')
    value = t[k++]
  }

  for (; k < len; k++) {
    if (k in t) {
      value = callback(value, t[k], k, t)
    }
  }
  return value
}

export function constantize(string='') {
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

function isObject(suspect) {
  var type = typeof suspect
  return !!suspect && (type == 'object' || type == 'function')
}

function objSome(collection, predicate) {
  for (const key in collection) {
    if (predicate(collection[key], key, collection)) return true
  }

  return false
}

export function some(collection, predicate) {
  return isObject(collection) ? objSome(collection, predicate) : arraySome(collection, predicate)
}

export function tail(collection) {
  return Array.prototype.slice.call(collection, 1)
}

export function first(collection) {
  return collection[0]
}

export function none(collection, predicate) {
  return !some(collection, predicate)
}

export const any = some

export function each(collection, iterator) {
  return function() {
    return Array.prototype.forEach.call(collection, iterator)
  }
}
