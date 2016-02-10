import expect from 'expect.js'
import { constantize, reduce, some, any, tail, first } from '../src/utils'

describe('Utils', () => {
  describe('constantize', () => {
    it('capitalizes and camel-cases a string', () => {
      expect(constantize('some_constant')).to.equal('SomeConstant')
    })
  })

  describe('reduce', () => {
    it('reduces a list to the product of an iterator', () => {
      let sum = reduce([1,1], (i, a) => a + i, 0)
      let sum2 = reduce([1,2,3,4], (i, a) => a + i, 0)
      expect(sum).to.equal(2)
      expect(sum2).to.equal(10)
    })
  })

  describe('some', () => {
    it('determines if some items pass the predicate test', () => {
      expect(some([1,2], (i) => i === 2)).to.equal(true)
    })

    it('is aliased as any', () => {
      expect(any([1,2], (i) => i === 2)).to.equal(true)
    })
  })

  describe('tail', () => {
    it('returns the array minus the first element', () => {
      let subject = tail([1,2,3])
      expect(subject[0]).to.equal(2)
      expect(subject[1]).to.equal(3)
      expect(subject.length).to.equal(2)
    });
  })

  describe('first', () => {
    it('returns the first element in the array', () => {
      let subject = first([1,2,3])
      expect(subject).to.equal(1)
    })
  })
})
