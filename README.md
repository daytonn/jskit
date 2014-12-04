JSKit
=====

JSKit is a tiny library to end the problem of jQuery soup and `$(document).ready()` mess. JSKit introduces a simple, clean, and easily testable way to architect basic javascript enhanced web pages. Based on a simple event system, JSKit allows your back-end application seamlessly integrate your javacsript code with minimal coupling.

Table of Contents
-----------------
1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Dispatcher](#dispatcher)
4. [Controllers](#controllers)
5. [Mixnins](#mixins)
6. [Testing](#testing)
7. [Contributing](#contributing)


Installation
---------------

### Download
* Download the latest version
  * [jskit.js](https://raw.githubusercontent.com/daytonn/jskit/master/dist/jskit.js)
  * [jskit.min.js](https://raw.githubusercontent.com/daytonn/jskit/master/dist/jskit.min.js)
* Include Script
  * include the `jskit.js` file in your application


```html
<script type="text/javascript" src="path/to/jskit.js"></script>
```


Basic Usage
-----------
The `Application` is the interface to your JSKit components. To create an application you simply call `createApplication`:

```js
var App = JSKit.createApplication();
```

### Dispatcher

Every application has a `Dispatcher` that allows registry and triggering of events throughout your JSKit application. In fact, JSKit is basically a thin wrapper around the `Dispatcher` that allows you to coordinate your javascript with minimal friction.

```js
App.Dispatcher.on("some-event-name", function() {
    // handle some-event-name
});

App.Dispatcher.trigger("some-event-name");
```

Generally you will not have to manually register for events (`App.Dispatcher.on`) since JSKit `Controllers` register their own actions automatically.

### Creating Controllers

The basic component of a JSKit application is a Controller. Controllers are basically objects that map actions to events. To create a controller, call `createController`:

```js
App.createController("Posts", {
  actions: ["index", "show", "new", "edit"],

  index: function() {
    // handle index action
  },

  show: function() {
    // handle show action
  }

  new: function() {
    // handle new action
  }

  edit: function() {
    // handle edit action
  }
})
```

When the `Application` creates a controller, it handles injecting the Controller with it's `Dispatcher`, creating the Controller's constructor, and instantiating an instance of the controller.

Controller instances are stored in `Application.Controllers` by name. Looking at the "Post" controller example above we know that there is an instance of a "Post" Controller in

```js
App.Controllers.Post
```

Controller constructors are stored on the `Application` object itself with the suffix "Controller".
and the `PostController` class constructor is at

```js
App.PostController
```

The Controller instance is what `Application` will use at runtime. The Controller's constructor is simply a convenience for creating clean states for testing.

<!-- TODO document name munging -->

Controllers
-----------
Controllers are the main component of a JSKit `Application`. Controllers accpet a single argument of a Dispatcher. The Dispatcher is passed automatically when a controller is created with the `Application.createController` method. Generally, you will only instantiate `Controller`s in your tests. Having the Dispatcher injected makes testing them in isolation much easier.

### Actions

Actions define which events your controller responds to. The `Controller` uses the `actions` array to map it's methods to the Dispatcher's events. Actions are automatically mapped to the Dispatcher when the `Controller` is instantiate. There are two ways to define an action mapping in your `Controller`s:

#### Named Actions

To map an action by name, simply provide the method name as a string in the actions array:

```js
App.createController("Posts", {
  actions: ["foo"],
  
  foo: function() {
    // handle "controller:posts:foo" event
  }
});
```

#### Mapped Actions

Sometimes you may want to map an action to a specific method, or you may want to bind two actions to the same method, to do so simply provide an object keyed by the action name with value of the method name:

```js
App.createController("Posts", {
  actions: [{ new: "setupForm" }, { edit: "setupForm" }],
  
  setupForm: function() {
    // handle "controller:posts:new" and "controller:posts:edit" events
  }
});
```

### Action Mapping

When an action is mapped, it will be registered on the dispatcher for a specific event. The event that is registered depends on a few properties of the `Controller`: `namspace`, `channel`, `name`, and `action`. The default values for these are:

    namespace = ""
    channel = "controller"
    controllerEventName = "<Controller.name>" (lowercase and underscored)
    action = "<action>
    eventSeperator = ":"

So using the above examples, the event maps for the `PostsController` are:

    controller:posts:foo  -> Controller.foo
    controller:posts:new  -> Controller.setupForm
    controller:posts:edit -> Controller.setupForm
    
*Note: undefined/empty values effectively removes that segment from the event name*
    
      
#### namespace

By default `Controller`s have an empty namespace. If you wish to prefix the events the `Controller` registers for with an namespace, set this property:

```js
App.createController("Posts", {
  namespace: "admin"
  ...
});
```

This will register all events with the `namespace` prefix:

    admin:controller:posts:foo  -> Controller.foo
    admin:controller:posts:new  -> Controller.setupForm
    admin:controller:posts:edit -> Controller.setupForm

#### channel

The default channel for a `Controller` is `controller`. To change this simply set the channel:

```js
App.createController("Posts", {
  channel: "pages"
  ...
});
```

This will register all events with the `channel`:

    pages:posts:foo  -> Controller.foo
    pages:posts:new  -> Controller.setupForm
    pages:posts:edit -> Controller.setupForm
    
#### controllerEventName

The `Controller` is given a `name` property by the `Application.createController(name, attributes)` method. The `controllerEventName` is automatically createds by lowercasing and underscoring the `name` to normalize event names. The `PostsController` example has the `name` "Posts" and a `controllerEventName` of "posts". CamelCased names will have underscores between each uppercased word:

```js
App.createController("CamelCase");
```

This would register all events with the controller `controllerEventName` of `camel_case`:

    controller:camel_case:<action> -> Controller.<action>
    
#### eventSeperator

The `eventSeperator` property defines how the `namespace`, `channel`, `name`, and `action` will be joined to create an event name. You can change this by setting the `eventSeperator` on the `Controller`:

```js
App.createController("Posts", {
  eventSeperator: "."
  ...
});
```

This would register all events using "." as a seperator:

    controller.posts.foo  -> Controller.foo
    controller.posts.new  -> Controller.setupForm
    controller.posts.edit -> Controller.edit
    

### The `all` event

Every controller has an automatically wired `all` action. Other than being automatically wired, it is a simple action->event map like any other:

    controller:posts:all -> Controller.all
    
### actionEventName

The `actionEventName` method allows you to get the full event name of a given action. It returns the `namespace`, `channel`, `controllerEventName`, and the `action` joined by the `eventSeperator`:

```js
var controller = App.createController("Posts");
controller.actionEventName("index"); // controller:posts:index
controller.actionEventName("show"); // controller:posts:show
controller.actionEventName("new"); // controller:posts:new
controller.actionEventName("edit"); // controller:posts:edit
controller.actionEventName(); // controller:posts
```

### className

Every Controller has a `className`. The `className` property is generated by capitalizing the `name` and adding the suffix "Controller". This property is used to display the Controller's constructor name in error output. Given the "Posts" Controller, the `controllerName` would be: `PostsController`.

Mixins
------

Mixins allow you to define common functionality that can be "mixed in" to any controller. This provides a way to share functionality without inheritance. Here is an example of a mixin that adds [CRUD](http://en.wikipedia.org/wiki/Create,_read,_update_and_delete) actions to a controller:

```js
var CrudActions = {
  action: ["index", "show", "new", "edit"],
  
  index: function() {},
  show: function() {},
  new: function() {},
  edit: function() {}
}

App.createController("Posts", CrudActions, {
  actions: ["custom"],
  
  index: function() {
    ...
  },
  
  custom: function() {
    ...
  }
});

App.createController("Comments", CrudActions, {
  show: function() {
    ...
  }
});
```

Using the `CrudActions` mixin, both the `Posts` controller and the `Comments` controller will have `index`, `show`, `new`, and `edit` actions. However, in this mixin the specific action behavior is left to be implemented in each controller's definition. You may also choose to define the method within the mixin. Since mixins are "mixed in" before the controller is defined, the mixin methods will execute in the controller's scope, allowing you to use `this` references safely:

```js
var CustomMixin = {
  action: ["custom"],
  customProperty: "some property",
  
  custom: function() {
    return this.customProperty;
  }
}

App.createController("Posts", CustomMixin, {
  actions: ["index"],
  
  index: function() {
    this.custom(); // "some property" 
  }
});

App.createController("Comments", CustomMixin, {
  actions: ["index"],
  
  initialize: function() {
    this.customProperty = "overridden";
  },
  
  index: function() {
    this.custom(); // "overridden" 
  }
});
```

*Note: Mixin properties are NOT copied deeply. Aside from the `actions` array, array properties are not merge and deeply nested references will not be cloned. Because of this, Mixin usage is considered experimental and should be used with caution.*

Testing
-------

JSKit is all about making testing javascript easier. JSKit itself comes with some handy tools for testing JSKit applications. When you create a controller with the `Application.createController` method. The created Controller's constructor will be available on the `Application` object using the Controller's `className`. Using the "Posts" controller example:

```js
App.PostsController
```

**_ALWAYS_** use the provided constructors when testing your Controllers to ensure you don't pollute your tests with mutated state.

### TestDispatcher

The `TestDispatcher` is used to help test JSKit Controllers. You should always use the `TestDispatcher` when testing Controllers. To create a controller with the `TestDispatcher` simply pass it to the Controller:

```js
describe("PostsController", function() {
  var subject;
  var dispatcher;
  
  beforeEach() {
    dispatcher = new JSKit.TestDispatcher;
    subject = new App.PostsController(dispatcher);
  }
  ...  
};
```

#### spies

When your Controller registers events on the `TestDispatcher`, your Controller's action methods will be enhanced with properties to determine if and how they were called:

```js
...
it("calls index when the index event is triggered", function() {
  dispatcher.trigger(controller.actionEventName("index"));
  
  expect(controller.index.called).to.equal(true);
  expect(controller.index.callCount).to.equal(1);

  expect(controller.index.calls[0].args).to.be.empty();
});
...   
```

Controller methods themselves will also have spy properties to make testing them smoother:

```js
...
it("should call nonActionMethod", function()  {
  controller.nonActionMethod("test"));
  
  expect(controller.nonActionMethod.called).to.equal(true);
  expect(controller.nonActionMethod.callCount).to.equal(1);

  expect(controller.nonActionMethod.calls[0].args.length).to.equal(1);
  expect(controller.nonActionMethod.calls[0].args).to.contain("test");
});
...
```

### hasAction

Most of the time, you will not need the extra functionality provided by spies and you simply want to see if a Controller's actions are wired up correctly. You can do this simply by calling `hasAction` with the controller and action you wish to test:

```js
...
var subject;
var dispatcher;
  
beforeEach() {
  dispatcher = new JSKit.TestDispatcher;
  subject = new App.PostsController(dispatcher);
}
  
it("has an index action", function() {
  expect(dispatcher.hasAction(subject, "index")).to.equal(true);
});
...
```

Contributing
------------
1. [Fork it](https://github.com/daytonn/jskit/fork)
2. Clone it locally
3. Set the upstream remote (`git remote add upstream git@github.com:daytonn/jskit.git`)
4. Install the dependencies with npm (`npm install`)
5. Run the specs with `npm test`
6. Run the example app with `npm start`
7. Create your feature branch (`git checkout -b my-new-feature`)
8. Commit your changes (`git commit -am 'Add some feature'`)
9. Rebase from upstream (`git rebase upstream master`)
10. Push to the branch (`git push origin my-new-feature`)
11. Create new Pull Request
