/* eslint max-nested-callbacks: 0, no-magic-numbers: 0 */
import {
  createAttributePair,
  extend,
  isArray,
  isDefined,
  isEmpty,
  isNotEmpty,
  isUndefined,
  objectsAreEqual,
  requireArgument,
  requireCondition,
  snakeCase,
  toArray,
  uniqueId,
  value,
} from "utils"

describe("utils", () => {
  describe("isUndefined", () => {
    it("returns true when the given value is undefined", () => {
      expect(isUndefined()).to.equal(true)
    })

    it("returns true when the given value is null", () => {
      expect(isUndefined(null)).to.equal(true)
    })

    it("returns false when the given value is a string", () => {
      expect(isUndefined("defined")).to.equal(false)
    })

    it("returns false when the given value is a number", () => {
      expect(isUndefined(1)).to.equal(false)
    })

    it("returns false when the given value is an array", () => {
      expect(isUndefined([])).to.equal(false)
    })

    it("returns false when the given value is an object", () => {
      expect(isUndefined({})).to.equal(false)
    })

    it("returns false when the given value is a boolean", () => {
      expect(isUndefined(false)).to.equal(false)
      expect(isUndefined(true)).to.equal(false)
    })
  })

  describe("isDefined", () => {
    it("returns false when the given value is undefined", () => {
      expect(isDefined()).to.equal(false)
    })

    it("returns false when the given value is null", () => {
      expect(isDefined(null)).to.equal(false)
    })

    it("returns true when the given value is a string", () => {
      expect(isDefined("defined")).to.equal(true)
    })

    it("returns true when the given value is a number", () => {
      expect(isDefined(1)).to.equal(true)
    })

    it("returns true when the given value is an array", () => {
      expect(isDefined([])).to.equal(true)
    })

    it("returns true when the given value is an object", () => {
      expect(isDefined({})).to.equal(true)
    })

    it("returns true when the given value is a boolean", () => {
      expect(isDefined(false)).to.equal(true)
      expect(isDefined(true)).to.equal(true)
    })
  })

  describe("isArray", () => {
    it("returns true when the given value is an array", () => {
      expect(isArray([])).to.equal(true)
    })

    it("returns false when the fiven value is not an array", () => {
      expect(isArray("string")).to.equal(false)
    })
  })

  describe("requireArgument", () => {
    let message
    let argument

    beforeEach(function() {
      message = "error message"
    })

    it("requires a message", () => {
      expect(() => requireArgument(argument)).to.throw("requireArgument(argument, message): message is undefined")
    })

    it("throws an error with the given message if the argument is undefined", () => {
      expect(() => requireArgument(argument, message)).to.throw(message)
    })

    it("does not throw an error if the argument is defined", () => {
      argument = "defined"
      expect(() => requireArgument(argument, message)).to.not.throw(message)
    })
  })

  describe("requireCondition", () => {
    it("requires a message", () => {
      expect(() => requireCondition(true)).to.throw("requireCondition(condition, message): message is undefined")
    })

    it("throws an error with the given message if the condition evaluates false", () => {
      expect(() => requireCondition(2 + 2 === 3, "error message")).to.throw("error message")
    })

    it("does not throw an error if the condition evaluates true", () => {
      expect(() => requireCondition(2 + 2 === 4, "error message")).to.not.throw("error message")
    })
  })

  describe("toArray", () => {
    let form
    let formField

    beforeEach(() => {
      form = document.createElement("form")
      formField = document.createElement("input")
      form.appendChild(formField)
    })

    it("requires form elements", () => {
      expect(() => toArray()).to.throw("toArray(value): value is undefined")
    })

    it("returns an array of form elements", () => {
      expect(toArray(form)).to.be.an.instanceof(Array)
      expect(toArray(form)).to.contain(formField)
    })
  })

  describe("objectsAreEqual", () => {
    let objectA = { key: "value", anotherKey: "value" }
    let objectB = { key: "value", anotherKey: "value" }
    let objectC = { key: "no match", anotherKey: "no match" }

    it("requires an objectA", () => {
      expect(() => objectsAreEqual()).to.throw("objectsAreEqual(objectA, objectB): objectA is undefined")
    })

    it("requires an objectB", () => {
      expect(() => objectsAreEqual(objectA)).to.throw("objectsAreEqual(objectA, objectB): objectB is undefined")
    })

    it("returns true when the two objects have the same keys and values", () => {
      expect(objectsAreEqual(objectA, objectB)).to.equal(true)
    })
  })

  describe("isEmpty", () => {
    it("requires a suspect", () => {
      expect(() => isEmpty()).to.throw("isEmpty(suspect): suspect is undefined")
    })

    it("returns true if the suspect has no length", () => {
      expect(isEmpty([])).to.equal(true)
      expect(isEmpty({})).to.equal(true)
      expect(isEmpty("")).to.equal(true)
    })

    it("returns false if the suspect has length", () => {
      expect(isEmpty([1])).to.equal(false)
      expect(isEmpty({ foo: "bar" })).to.equal(false)
      expect(isEmpty("hello")).to.equal(false)
    })
  })

  describe("isNotEmpty", () => {
    it("requires a suspect", () => {
      expect(() => isNotEmpty()).to.throw("isNotEmpty(suspect): suspect is undefined")
    })

    it("returns false if the suspect has no length", () => {
      expect(isNotEmpty([])).to.equal(false)
      expect(isNotEmpty({})).to.equal(false)
      expect(isNotEmpty("")).to.equal(false)
    })

    it("returns true if the suspect has length", () => {
      expect(isNotEmpty([1])).to.equal(true)
      expect(isNotEmpty({ foo: "bar" })).to.equal(true)
      expect(isNotEmpty("hello")).to.equal(true)
    })
  })

  describe("snakeCase", () => {
    it("returns a lower case string", () => {
      expect(snakeCase("SnAkECase")).to.equal("snakecase")
    })

    it("replaces hyphens with underscores", () => {
      expect(snakeCase("Snake-Case")).to.equal("snake_case")
    })

    it("replaces spaces with underscores", () => {
      expect(snakeCase("Snake Case")).to.equal("snake_case")
    })
  })

  describe("uniqueId", () => {
    it("creates a unique id string", () => {
      expect(uniqueId()).to.be.a("string")
      expect(uniqueId()).to.match(/^[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}/)
    })
  })

  describe("value", () => {
    it("returns the value passed to it", () => {
      let nil = null
      let undef
      let string = "foo"
      let number = 1
      let list = [1, 2, 3]
      let object = {}
      let regex = new RegExp()

      expect(value(nil)).to.equal(nil)
      expect(value(undef)).to.equal(undef)
      expect(value(string)).to.equal(string)
      expect(value(number)).to.equal(number)
      expect(value(list)).to.equal(list)
      expect(value(object)).to.equal(object)
      expect(value(regex)).to.equal(regex)
    })

    it("returns the result of a function", () => {
      let foo = () => "foo"
      expect(value(foo)).to.equal("foo")
    })
  })

  describe("extend", () => {
    it("copies object 1 level deep", () => {
      let destination = { one: 1, two: 2 }
      let source = { three: 3 }

      expect(extend(destination, source).three).to.equal(3)
    })

    it("overwrites keys in argument order", () => {
      let destination = { one: 1, two: 2 }
      let source1 = { one: 5, three: 3 }
      let source2 = { two: 7, three: 15 }

      expect(extend(destination, source1, source2).one).to.equal(5)
      expect(extend(destination, source1, source2).two).to.equal(7)
      expect(extend(destination, source1, source2).three).to.equal(15)
    })

    it("does not mutate the destination object", () => {
      let destination = { one: 1, two: 2 }
      let source = { three: 3 }

      let result = extend(destination, source)
      expect(destination).to.not.have.key("three")
      expect(destination).to.not.equal(result)
    })

    it("does not mutate the source object", () => {
      let destination = { one: 1, two: 2 }
      let source = { three: 3 }

      let result = extend(destination, source)
      expect(source).to.not.have.key("one")
      expect(source).to.not.have.key("two")
      expect(source).to.not.equal(result)
    })
  })
})
