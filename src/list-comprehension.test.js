/* eslint no-undefined: 0, no-magic-numbers: 0 */
import {
  compact,
  contains,
  each,
  filter,
  first,
  flatten,
  functions,
  includes,
  last,
  mapObject,
  none,
  reduce,
  reject,
  some,
  tail,
  unique,
} from 'list-comprehension'

describe('list comprehension', () => {
  describe('compact', () => {
    it('requires a list', () => {
      expect(() => compact()).to.throw('compact(list): list is undefined but required')
    })

    it('returns a new list without empty values', () => {
      let list = [1, undefined, 2, null, 3]
      expect(compact(list)).to.eql([1, 2, 3])
    })
  })

  describe('contains', () => {
    let list = [1, 2, 3]

    it('requires a list', () => {
      expect(() => contains()).to.throw('contains(list, suspect): list is undefined but required')
    })

    it('requires a suspect', () => {
      expect(() => contains(list)).to.throw('contains(list, suspect): suspect is undefined but required')
    })

    it('returns true when the list contains the suspect', () => {
      expect(contains(list, 1)).to.eq(true)
      expect(contains(list, 2)).to.eq(true)
      expect(contains(list, 3)).to.eq(true)
    })

    it('returns false when the list does not contain the suspec', () => {
      expect(contains(list, 5)).to.eq(false)
    })

    it('coerces values for the comparison', () => {
      list = [{ key: 'value' }]
      expect(contains(list, { key: 'value' })).to.eq(true)
    })
  })

  describe('filter', () => {
    it('requires a list', () => {
      expect(() => filter()).to.throw('filter(list, iterator): list is undefined but required')
      expect(() => filter('not an array')).to.throw('filter(list, iterator): list is not an Array but should be')
    })

    it('requires an iterator', () => {
      expect(() => filter([])).to.throw('filter(list, iterator): iterator is undefined but required')
      expect(() => filter([], 'not a function')).to.throw('filter(list, iterator): iterator is not a function but should be')
    })

    it('returns a new list of items with those that fail the truth test', () => {
      let list = [1, 1, 2]
      let result = filter(list, (i) => i === 1)

      expect(result).to.not.eql(list)
      expect(result.length).to.eq(2)
      expect(result).to.contain(1)
      expect(result).to.not.contain(2)
    })
  })

  describe('reduce', () => {
    it('requires a collection', () => {
      expect(() => reduce()).to.throw('reduce(collection, iterator, accumulator): collection is undefined but required')
    })

    it('requires an iterator', () => {
      expect(() => reduce([])).to.throw('reduce(collection, iterator, accumulator): iterator is undefined but required')
      expect(() => reduce([], 'not a function')).to.throw('reduce(collection, iterator, accumulator): iterator is not a function but should be')
    })

    it('returns the accumulator', () => {
      expect(reduce([], (v) => v, 'accumulator')).to.eq('accumulator')
    })

    it('passes the accumulator to the iterator for each item', () => {
      expect(reduce([2, 2], (accumulator, value) => accumulator + value, 0)).to.eq(4)
    })
  })

  describe('reject', () => {
    it('requires a list', () => {
      expect(() => reject()).to.throw('reject(list, iterator): list is undefined but required')
      expect(() => reject('not an array')).to.throw('reject(list, iterator): list is not an Array but should be')
    })

    it('requires an iterator', () => {
      expect(() => reject([])).to.throw('reject(list, iterator): iterator is undefined but required')
      expect(() => reject([], 'not a function')).to.throw('reject(list, iterator): iterator is not a function but should be')
    })

    it('returns a new list of items without those that fail the truth test', () => {
      let list = [1, 1, 2]
      let result = reject(list, (i) => i === 1)

      expect(result).to.not.eql(list)
      expect(result.length).to.eq(1)
      expect(result).to.contain(2)
      expect(result).to.not.contain(1)
    })
  })

  describe('tail', () => {
    it('requires a list', () => {
      expect(() => tail()).to.throw('tail(list): list is undefined but required')
    })

    it('returns a new array excluding the first item in the list', () => {
      let list = [1, 2, 3]
      expect(tail(list).length).to.eq(2)
      expect(tail(list)).to.not.contain(1)
      expect(tail(list)).to.contain(2)
      expect(tail(list)).to.contain(3)
    })
  })

  describe('some', () => {
    it('requires a list', () => {
      expect(() => some()).to.throw('some(list, iterator): list is undefined but required')
    })

    it('requires an iterator', () => {
      expect(() => some([])).to.throw('some(list, iterator): iterator is undefined but required')
    })

    it('returns true if any of the items pass the truth test', () => {
      let list = [1, 2, 3]
      let result = some(list, item => item === 2)
      expect(result).to.eq(true)
    })

    it('returns false if none of the items pass the truth test', () => {
      let list = [1, 2, 3]
      let result = some(list, item => item === 5)
      expect(result).to.eq(false)
    })
  })

  describe('none', () => {
    it('requires a list', () => {
      expect(() => none()).to.throw('none(list, iterator): list is undefined but required')
    })

    it('requires an iterator', () => {
      expect(() => none([])).to.throw('none(list, iterator): iterator is undefined but required')
    })

    it('returns true if none of the items pass the truth test', () => {
      let list = [1, 2, 3]
      let result = none(list, item => item === 5)
      expect(result).to.eq(true)
    })

    it('returns false if any of the items pass the truth test', () => {
      let list = [1, 2, 3]
      let result = none(list, item => item === 2)
      expect(result).to.eq(false)
    })
  })

  describe('first', () => {
    it('requires a list', () => {
      expect(() => first()).to.throw('first(list): list is undefined but required')
    })

    it('returns the first item in the list', () => {
      let list = [1, 2, 3]
      expect(first(list)).to.eq(1)
    })

    it('returns undefined if the item is empty', () => {
      expect(first([])).to.be.undefined
    })
  })

  describe('last', () => {
    it('requires a list', () => {
      expect(() => last()).to.throw('last(list): list is undefined but required')
    })

    it('returns the last item in the list', () => {
      let list = [1, 2, 3]
      expect(last(list)).to.eq(3)
    })

    it('returns undefined if the item is empty', () => {
      expect(last([])).to.be.undefined
    })
  })

  describe('each', () => {
    it('requires a collection', () => {
      expect(() => each()).to.throw('each(collection, iterator): collection is undefined but required')
    })

    it('requires an iterator', () => {
      expect(() => each([])).to.throw('each(collection, iterator): iterator is undefined but required')
    })

    it('invokes an iterator for each item of an array', () => {
      let list = [1, 2, 3]
      each(list, (item, i) => expect(item).to.eq(i + 1))
    })

    it('invokes an iterator for each key value pair of an object', () => {
      let object = { one: 1, two: 2, three: 3 }
      each(object, (value, key) => {
        expect(value).to.be.a.number
        expect(key).to.be.a.string
      })
    })
  })

  describe('includes', () => {
    it('requires a list', () => {
      expect(() => includes()).to.throw('includes(list, value): list is undefined but required')
    })

    it('returns true when the item is present in the array', () => {
      let list = [1, 2, 3]
      expect(includes(list, 2)).to.eq(true)
    })

    it('returns false when the item is not present in the array', () => {
      let list = [1, 2, 3]
      expect(includes(list, 5)).to.eq(false)
    })
  })

  describe('flatten', () => {
    it('requires a list', () => {
      expect(() => flatten()).to.throw('flatten(list): list is undefined but required')
    })

    it('returns a one dimensional array', () => {
      let list = [1, 2, 3, [4, 5, [6, 7]]]
      let result = flatten(list)
      expect(result.length).to.eq(7)
      expect(result).to.contain(1)
      expect(result).to.contain(2)
      expect(result).to.contain(3)
      expect(result).to.contain(4)
      expect(result).to.contain(5)
      expect(result).to.contain(6)
      expect(result).to.contain(7)
    })
  })

  describe('functions', () => {
    it('requires a collection', () => {
      expect(() => functions()).to.throw('functions(collection): collection is undefined but required')
    })

    describe('given an array', () => {
      it('returns a list of the function items', () => {
        let fn = () => {}
        let list = [1, fn, 3]
        expect(functions(list)).to.contain(fn)
        expect(functions(list).length).to.eq(1)
      })
    })

    describe('given an object', () => {
      it('returns a list of keys bound to functions', () => {
        let fn = () => {}
        let object = { one: 1, two: fn, three: 3 }

        expect(functions(object)).to.contain('two')
        expect(functions(object).length).to.eq(1)
      })
    })
  })

  describe('mapObject', () => {
    it('requires an object', () => {
      expect(() => mapObject()).to.throw('mapObject(object, iterator): object is undefined but required')
    })

    it('requires an iterator', () => {
      expect(() => mapObject({})).to.throw('mapObject(object, iterator): iterator is undefined but required')
    })

    it('returns the product of the iterator for each key value pair', () => {
      let object = { one: 1, two: 2, three: 3 }
      let mappedObject = mapObject(object, (value, key) => `${key} = ${value}`)

      expect(mappedObject).to.contain('one = 1')
      expect(mappedObject).to.contain('two = 2')
      expect(mappedObject).to.contain('three = 3')
    })
  })

  describe('unique', () => {
    it('returns a collection with only unique items', () => {
      let list = [1, 1, 2, 2, 3, 3]
      let uniqueList = unique(list).sort()

      expect(uniqueList.length).to.eq(3)
      expect(uniqueList[0]).to.eq(1)
      expect(uniqueList[1]).to.eq(2)
      expect(uniqueList[2]).to.eq(3)
    })
  })
})
