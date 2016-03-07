import expect from 'expect'
import {
  map,
  reduce,
  constantize,
  isObject,
  some,
  tail,
  first,
  none,
  any,
  each,
  isFunction,
  functions,
  bind
} from '../src/utils'

describe('Utils', () => {

  describe('map', () => {
    it('maps an iterator over each item in a list, returning a new list', () => {
      expect([1,2,3].map((n) => n + 1)).toEqual([2,3,4])
    })
  })

  describe('reduce', () => {
    it('reduces a list to the product of an iterator', () => {
      let sum = reduce([1,1], (i, a) => a + i, 0)
      let sum2 = reduce([1,2,3,4], (i, a) => a + i, 0)
      expect(sum).toEqual(2)
      expect(sum2).toEqual(10)
    })
  })

  describe('constantize', () => {
    it('capitalizes and camel-cases a string', () => {
      expect(constantize('some-constant')).toEqual('SomeConstant')
      expect(constantize('some_constant')).toEqual('SomeConstant')
      expect(constantize('some constant')).toEqual('SomeConstant')
      expect(constantize('Some-_ constant')).toEqual('SomeConstant')
      expect(constantize('some -_Constant')).toEqual('SomeConstant')
    })
  })

  describe('isObject', () => {
    it('determines if the suspect is an object', () => {
      expect(isObject({})).toEqual(true)
      expect(isObject([])).toEqual(true)
      expect(isObject(() => {})).toEqual(true)
      expect(isObject(4)).toEqual(false)
      expect(isObject('')).toEqual(false)
    })
  })

  describe('some', () => {
    it('determines if some items pass the predicate test', () => {
      expect(some([1,2], (i) => i === 2)).toEqual(true)
    })

    it('is aliased as any', () => {
      expect(any([1,2], (i) => i === 2)).toEqual(true)
    })
  })

  describe('tail', () => {
    it('returns the array minus the first element', () => {
      let subject = tail([1,2,3])
      expect(subject[0]).toEqual(2)
      expect(subject[1]).toEqual(3)
      expect(subject.length).toEqual(2)
    });
  })

  describe('first', () => {
    it('returns the first element in the array', () => {
      let subject = first([1,2,3])
      expect(subject).toEqual(1)
    })
  })

  describe('none', () => {
    it('determines if no elements pass the predicate test', () => {
      expect(none([1,2,3], (n) => n == 4)).toEqual(true)
      expect(none([1,2,3], (n) => n == 3)).toEqual(false)
    })
  })

  describe('each', () => {
    it('executes the iterator for each item', () => {
      let items = [1]
      each(items, (item, i, list) => {
        expect(item).toEqual(1)
        expect(i).toEqual(0)
        expect(list).toEqual(items)
      })
    })

    it('iterates over objects', () => {
      let items = { one: 1 }

      each(items, (value, key, list) => {
        expect(value).toEqual(1)
        expect(key).toEqual('one')
        expect(list).toEqual(items)
      })
    })
  })

  describe('isFunction', () => {
    it('determines if the suspect is a function', () => {
      expect(isFunction('function')).toEqual(false)
      expect(isFunction({})).toEqual(false)
      expect(isFunction([])).toEqual(false)
      expect(isFunction(() => {})).toEqual(true)
      expect(isFunction(expect)).toEqual(true)
    })
  })

  describe('functions', () => {
    it('returns a list of function properties of the given object', () => {
      let suspect = {
        one: 1,
        two: function() {},
        three: () => {}
      }
      expect(functions(suspect)).toEqual(['two', 'three'])
    })
  })

  describe('bind', () => {
    it('binds a function to a given context', () => {
      let context = { name: 'test' }
      let fn = function() { return this.name }
      let boundFn = bind(context, fn)
      expect(boundFn()).toEqual('test')
    })
  })
})
