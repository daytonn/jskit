describe('Controller', () => {
  var extend = _.extend;
  var each = _.each;
  var dispatcher;
  var subject;
  var testControllerDefaults;
  var indexCalled;
  var allCalled;
  var actionCalled;
  var anotherActionCalled;
  var $fixtures;

  beforeEach(function() {
    $fixtures = $('#fixtures');
    dispatcher = JSkit.Dispatcher.create();
    testControllerDefaults = {
      name: 'Test',
      actions: ['index', { mapped: 'action', another: 'anotherAction' }],
      dispatcher: dispatcher,
      all: function() { allCalled = true; },
      index: function() { indexCalled = true; },
      action: function() { actionCalled = true; },
      anotherAction: function() { anotherActionCalled = true; }
    };
    subject = JSkit.Controller.create(extend({}, testControllerDefaults));
  });

  describe('defaults', () => {
    beforeEach(function() {
      subject = JSkit.Controller.create({ name: 'Test' });
    });

    it('requires a name', () => {
      expect(function() {
        JSkit.Controller.create();
      }).to.throw(/name is undefined/);
    });

    it('has a default dispatcher', () => {
      expect(subject.dispatcher).to.be.an('Object');
    });

    it('has an actions array', () => {
      expect(subject.actions).to.be.an('Array');
    });

    it('has a default channel', () => {
      expect(subject.channel).to.equal('controller');
    });

    it('has a default initialize method', () => {
      expect(subject.initialize).to.be.a('Function');
    });

    it('has a default controllerEventName', () => {
      expect(subject.controllerEventName).to.equal('test');
    });

    it('has an eventSeparator', () => {
      expect(subject.eventSeparator).to.equal(':');
    });

    it('has an all function', () => {
      expect(subject.all).to.be.a('Function');
    });

    it('has an elements object', () => {
      expect(subject.elements).to.be.an('Object');
    });
  });

  describe('options', () => {
    it('has an index action', () => {
      expect(subject).to.have.action('index');
    });

    it('has a mapped action', () => {
      expect(subject).to.have.action('mapped', 'action');
    });

    it('restricts keywords', () => {
      expect(function() {
        JSkit.Controller.create(extend({}, testControllerDefaults, {
          name: 'Test',
          registerEvents: 'invalid'
        }));
      }).to.throw('JSkit.Controller.create: registerEvents is a restricted keyword');

      expect(function() {
        JSkit.Controller.create(extend({}, testControllerDefaults, {
          name: 'Test',
          registerActions: 'invalid'
        }));
      }).to.throw('JSkit.Controller.create: registerActions is a restricted keyword');

      expect(function() {
        JSkit.Controller.create(extend({}, testControllerDefaults, {
          name: 'Test',
          cacheElements: 'invalid'
        }));
      }).to.throw('JSkit.Controller.create: cacheElements is a restricted keyword');

      expect(function() {
        JSkit.Controller.create(extend({}, testControllerDefaults, {
          name: 'Test',
          eventNameForAction: 'invalid'
        }));
      }).to.throw('JSkit.Controller.create: eventNameForAction is a restricted keyword');
    });
  });

  describe('actions', () => {
    it('normalizes the actions', () => {
      expect(subject.__actions__).to.be.like([
        { name: 'all', method: 'all' },
        { name: 'index', method: 'index' },
        { name: 'mapped', method: 'action' },
        { name: 'another', method: 'anotherAction' }
      ]);
    });

    it('registers action methods on the dispatcher', () => {
      subject.dispatcher.trigger('controller:test:index');
      expect(indexCalled).to.be.true;

    });

    it('automatically wires the all event', () => {
      dispatcher.trigger('controller:test:all');
      expect(allCalled).to.equal(true);
    });

    it('wires up mapped actions', () => {
      dispatcher.trigger('controller:test:mapped');
      expect(actionCalled).to.equal(true);
    });

    it('wires up mapped actions with multiple maps', () => {
      dispatcher.trigger('controller:test:another');
      expect(anotherActionCalled).to.equal(true);
    });
  });

  describe('eventNameForAction', () => {
    it('returns the event string for a given action', () => {
      expect(subject.eventNameForAction('index')).to.equal('controller:test:index');
    });
  });

  describe('initialize', () => {
    var initializeCalled;

    beforeEach(function() {
      subject = JSkit.Controller.create(extend(testControllerDefaults, {
        initialize: function() { initializeCalled = true; }
      }));
    });

    it('calls initialize when the controller is constructed', () => {
      expect(initializeCalled).to.equal(true);
    });

    describe('elementCacheing registration', () => {
      var subject;
      beforeEach(function() {
        $fixtures.append('<a id='element' href='#'>Test</a>');
      });

      it('caches the elements for a given action', () => {
        subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
          elements: { index: { element: '#element' }}
        }));
        subject.dispatcher.trigger('controller:test:index');
        expect(subject.$element).to.have.$attr('id', 'element');
      });

      it('caches the elements for a mapped action', () => {
        subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
          elements: { mapped: { element: '#element' }}
        }));
        subject.dispatcher.trigger('controller:test:mapped');
        expect(subject.$element).to.have.$attr('id', 'element');
      });

      it('caches the elements for all actions', () => {
        subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
          elements: { all: { element: '#element'} }
        }));

        subject.dispatcher.trigger('controller:test:all');
        expect(subject.$element).to.have.$attr('id', 'element');
      });
    });

    describe('element event handler registration', () => {
      var subject;
      var handleElementClickCalled = false;

      beforeEach(function() {
        $fixtures.append('<a id='element' href='#'>Test</a>');
        handleElementClick = function() {
          handleElementClickCalled = true;
        };
      });

      it('registers the element handlers for an action', () => {
        subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
          elements: { index: { element: ['#element', { click: 'handleElementClick' }] }},
          handleElementClick: handleElementClick
        }));

        subject.dispatcher.trigger(subject.eventNameForAction('index'));
        subject.$element.trigger('click');
        expect(handleElementClickCalled).to.equal(true);
      });

      it('registers the element handlers for a mapped action', () => {
        subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
          elements: { mapped: { element: ['#element', { click: 'handleElementClick' }] }}
        }));

        subject.dispatcher.trigger(subject.eventNameForAction('mapped'));
        subject.$element.trigger('click');
        expect(handleElementClickCalled).to.equal(true);
      });

      it('registers the element handlers for all actions', () => {
        subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
          elements: { all: { element: ['#element', { click: 'handleElementClick' }] }}
        }));

        subject.dispatcher.trigger(subject.eventNameForAction('all'));
        subject.$element.trigger('click');
        expect(handleElementClickCalled).to.equal(true);
      });
    });

    describe('method binding', () => {
      beforeEach(function() {
        subject = JSkit.Controller.create({
          name: 'Bind',
          boundValue: 'bind-test',
          boundMethod: function() {
            return this.boundValue;
          }
        });
      });

      it('binds methods to the controller', () => {
        var reassigned = subject.boundMethod;
        expect(reassigned()).to.equal('bind-test');
      });
    });
  });

  describe('with missing action methods', () => {
    it('throws an error when an action is missing it's method', () => {
      expect(function() {
        var attrs = extend({}, testControllerDefaults, { index: undefined });
        JSkit.Controller.create(attrs);
      }).to.throw('Test action \'index:index\' method is undefined');
    });
  });

  describe('with namespace', () => {
    beforeEach(function() {
      var attrs = extend({}, testControllerDefaults, { namespace: 'admin' });
      subject = JSkit.Controller.create(attrs);
    });

    it('has a namespace', () => {
      expect(subject.namespace).to.equal('admin');
    });

    it('wires up the actions with the namespace', () => {
      subject.dispatcher.trigger('admin:controller:test:index');
      expect(indexCalled).to.equal(true);
    });
  });

  describe('with channel', () => {
    beforeEach(function() {
      var attrs = extend({}, testControllerDefaults, { channel: 'custom' });
      subject = JSkit.Controller.create(attrs);
    });

    it('has a channel', () => {
      expect(subject.channel).to.equal('custom');
    });

    it('wires up the actions with the channel', () => {
      dispatcher.trigger('custom:test:index');
      expect(indexCalled).to.equal(true);
    });
  });

  describe('with eventSeparator', () => {
    beforeEach(function() {
      var attrs = extend({}, testControllerDefaults, { eventSeparator: '.' });
      subject = JSkit.Controller.create(attrs);
    });

    it('wires up the actions with the eventSeparator', () => {
      subject.dispatcher.trigger('controller.test.index');
      expect(indexCalled).to.equal(true);
    });
  });

  describe('CamelCase controllers', () => {
    beforeEach(function() {
      var attrs = extend({}, testControllerDefaults, { name: 'CamelCase' });
      subject = JSkit.Controller.create(attrs);
    });

    it('lowercases the controller name with underscores', () => {
      subject.dispatcher.trigger('controller:camel_case:index');
      expect(indexCalled).to.equal(true);
    });
  });

  describe('with object action map', () => {
    var barCalled;

    beforeEach(function() {
      var attrs = extend({}, testControllerDefaults, {
        actions: ['index', { foo: 'bar' }],
        bar: function() { barCalled = true; }
      });
      subject = JSkit.Controller.create(attrs);
    });

    it('wires up mapped actions', () => {
      subject.dispatcher.trigger('controller:test:foo');
      expect(barCalled).to.equal(true);
    });

    it('wires up normal actions', () => {
      subject.dispatcher.trigger('controller:test:index');
      expect(indexCalled).to.equal(true);
    });
  });

  describe('elements', () => {
    beforeEach(function() {
      $fixtures.append('<a id='element' href='#'>Test</a>');
      subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
        elements: {
          index: { element: '#element' }
        }
      }));
    });

    it('creates a normalized list of elements', () => {
      expect(subject.__elements__).to.be.like({
        index: { element: '#element' }
      });
    });

    describe('with events', () => {
      beforeEach(function() {
        subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
          elements: {
            index: { element: ['#element', { click: 'handleClick' }] }
          }
        }));
      });

      it('creates a normalized list of elements', () => {
        expect(subject.__elements__).to.be.like({
          index: { element: '#element' }
        });
      });

      it('creates a normalized list of events', () => {
        expect(subject.__events__).to.be.like({
          index: {
            $element: { click: 'handleClick' }
          }
        });
      });
    });
  });

  describe('cacheElements', () => {
    var subject;
    beforeEach(function() {
      $fixtures.append('<a id='element' href='#'>Test</a>');
    });

    it('caches the elements for a given action', () => {
      subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
        elements: { index: { element: '#element' }}
      }));
      subject.cacheElements('index');
      expect(subject.$element).to.have.$attr('id', 'element');
    });

    it('caches the elements for a mapped action', () => {
      subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
        elements: { mapped: { element: '#element' }}
      }));
      subject.cacheElements('mapped');
      expect(subject.$element).to.have.$attr('id', 'element');
    });

    it('caches the elements for all actions', () => {
      subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
        elements: { all: { element: '#element'} }
      }));
      subject.cacheElements('all');
      expect(subject.$element).to.have.$attr('id', 'element');
    });

    it('throws an error if called with no action', () => {
      expect(function() {
        subject.cacheElements();
      }).to.throw('JSkit.Controller.cacheElements: action is undefined');
    });

    it('throws an error if the element is not in the DOM', () => {
      subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
        elements: {
          index: { element: '#non-existent' }
        }
      }));

      expect(function() {
        subject.cacheElements('index');
      }).to.throw('JSkit.Controller.cacheElements: #non-existent is not in the DOM');
    });

    describe('without jQuery', () => {
      var originalJQuery;
      var dollar;
      beforeEach(function() {
        originalJQuery = window.jQuery;
        dollar = window.$;
        window.jQuery = undefined;
        window.$ = undefined;
        subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
          elements: { index: { element: '#element' } }
        }));
      });

      afterEach(function() {
        window.jQuery = originalJQuery;
        window.$ = dollar;
      });

      it('falls back to querySelectorAll', () => {
        subject.cacheElements('index');
        expect(subject.$element.children).to.eq(document.querySelectorAll('#element').children);
      });
    });
  });

  describe('registerEvents', () => {
    var handleElementClickCalled;

    beforeEach(function() {
      $fixtures.append('<a id='element' href='#'>Test</a>');
      subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
        handleElementClick: function() { handleElementClickCalled = true; },
        elements: {
          mapped: { element: ['#element', { click: 'handleElementClick' }]},
          index: { element: ['#element', { click: 'handleElementClick' }] }
        }
      }));
    });

    it('caches the elements', () => {
      subject.registerEvents('index');
      expect(subject.$element).to.have.$attr('id', 'element');
    });

    it('caches the elements for mapped action', () => {
      subject.registerEvents('mapped');
      expect(subject.$element).to.have.$attr('id', 'element');
    });

    it('wires up events', () => {
      subject.registerEvents('index');
      subject.$element.trigger('click');
      expect(handleElementClickCalled).to.equal(true);
    });

    describe('multiple events', () => {
      var handleElementKeyupCalled;

      beforeEach(function() {
        subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
          handleElementClick: function() { handleElementClickCalled = true; },
          handleElementKeyup: function() { handleElementKeyupCalled = true; },

          elements: {
            index: { element: ['#element', { click: 'handleElementClick', keyup: 'handleElementKeyup' }] }
          }
        }));
      });

      it('wires up multiple events to the same element', () => {
        subject.registerEvents('index');

        subject.$element.trigger('click');
        expect(handleElementClickCalled).to.equal(true);

        subject.$element.trigger('keyup');
        expect(handleElementKeyupCalled).to.equal(true);
      });
    });

    describe('function event targets', () => {
      var handleElementClickCalled;

      beforeEach(function() {
        subject = JSkit.Controller.create(extend({}, testControllerDefaults, {
          handleElementClick: function() { handleElementClickCalled = true; },
          elements: {
            index: {
              element: ['#element', function(on) {
                on('click', this.handleElementClick);
              }]
            }
          }
        }));
      });

      it('wires up the events prescribed by the function', () => {
        subject.registerEvents('index');
        subject.$element.trigger('click');
        expect(handleElementClickCalled).to.equal(true);
      });
    });
  });
});
