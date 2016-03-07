import expect, { createSpy } from 'expect'
import Application from '../src/application'
import Controller from '../src/controller'


describe('Application', () => {
  var subject

  beforeEach(function() {
    subject = new Application
  })

  it('has a Controllers namespace', () => {
    expect(subject.Controllers).toBeAn(Object)
  })

  it('has a Dispatcher', () => {
    expect(subject.Dispatcher).toBeAn(Object)
  })

  describe('createController', () => {
    let controller

    beforeEach(function() {
      controller = subject.createController('Test', {
        actions: ['index'],
        index: createSpy()
      })
    })

    it('requires a name', () => {
      expect(() => {
        subject.createController()
      }).toThrow('Application.createController(name, attrs): name is undefined')
    })

    it('stores a reference to the factory', () => {
      expect(subject.TestController.create()).toBeA(Controller)
    })

    it('creates a controller instance on the App.Controllers namespace', () => {
      expect(subject.Controllers.Test).toBeA(Controller)
    })

    it('adds the name to the attributes', () => {
      expect(controller.name).toEqual('Test')
    })

    it('adds the dispatcher to the attributes', () => {
      expect(controller.dispatcher).toEqual(subject.Dispatcher)
    })

    it('returns the controller', () => {
      expect(controller).toExist()
    })

    it('has the defined methods', () => {
      expect(controller.index).toBeA(Function)
    })

    describe('controller name', () => {
      it('constantizes underscored names', () => {
        controller = subject.createController('underscored_name')
        expect(subject.Controllers.UnderscoredName).toExist()
        expect(subject.UnderscoredNameController).toExist()
      })

      it('constantizes names with spaces', () => {
        controller = subject.createController('name with spaces')
        expect(subject.Controllers.NameWithSpaces).toExist()
        expect(subject.NameWithSpacesController).toExist()
      })

      it('constantizes names with dashes', () => {
        controller = subject.createController('dashed-name')
        expect(subject.Controllers.DashedName).toExist()
        expect(subject.DashedNameController).toExist()
      })

      it('constantizes names with mixed characters', () => {
        controller = subject.createController('name with-mixed_characters')
        expect(subject.Controllers.NameWithMixedCharacters).toExist()
        expect(subject.NameWithMixedCharactersController).toExist()
      })
    })

    describe('controller factories', () => {
      var factory
      var controller

      beforeEach(function() {
        controller = subject.createController('Test', {
          actions: ['index'],
          index: createSpy(),
          foo: 'foo'
        })

        factory = subject.TestController
      })

      it('allows defaults to be overriden', () => {
        var factoryInstance = factory.create({ dispatcher: 'Other Dispatcher', foo: 'bar' })
        expect(factoryInstance.dispatcher).toEqual(subject.Dispatcher)
        expect(factoryInstance.foo).toEqual('bar')
      })
    })
  })
})