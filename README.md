JSKit
=====

JSKit is a tiny library to end the problem of jQuery soup and `$(document).ready()` mess. JSKit introduces a simple, clean, and easily testable way to architect basic javascript enhanced web pages. Based on a simple event system, JSKit allows your back-end application to seamlessly integrate your javacsript code with minimal coupling.

Table of Contents
-----------------
1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Dispatcher](#dispatcher)
4. [Controllers](#controllers)
5. [Testing](#testing)
6. [Contributing](#contributing)


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

When the `Application` creates a controller, it handles injecting the Controller with its `Dispatcher`, creating the Controller's constructor, and instantiating an instance of the controller.

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
Controllers are the main component of a JSKit `Application`. Controllers accept a single argument of a Dispatcher. The Dispatcher is passed automatically when a controller is created with the `Application.createController` method. Generally, you will only instantiate `Controller`s in your tests. Having the Dispatcher injected makes testing them in isolation much easier.

### Actions

Actions define to which events your controller responds. The `Controller` uses the `actions` array to map its methods to the Dispatcher's events. Actions are automatically mapped to the Dispatcher when the `Controller` is instantiated. There are two ways to define an action mapping in your `Controller`s:

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

When an action is mapped, it will be registered on the dispatcher for a specific event. The event that is registered depends on a few properties of the `Controller`: `namespace`, `channel`, `name`, and `action`. The default values for these are:

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

By default, `Controller`s have an empty namespace. If you wish to prefix the events the `Controller` registers for with an namespace, set this property:

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

The `Controller` is given a `name` property by the `Application.createController(name, attributes)` method. The `controllerEventName` is automatically created by lowercasing and underscoring the `name` to normalize event names. The `PostsController` example has the `name` "Posts" and a `controllerEventName` of "posts". CamelCased names will have underscores between each uppercased word:

```js
App.createController("CamelCase");
```

This would register all events with the controller `controllerEventName` of `camel_case`:

    controller:camel_case:<action> -> Controller.<action>

#### eventSeparator

The `eventSeparator` property defines how the `namespace`, `channel`, `name`, and `action` will be joined to create an event name. You can change this by setting the `eventSeparator` on the `Controller`:

```js
App.createController("Posts", {
  eventSeparator: "."
  ...
});
```

This would register all events using "." as a separator:

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
  expect(controller.index.calls[0].args).to.be.an("Array");
  expect(controller.index.calls[0].args).to.be.empty();
});
...
};
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
1. Clone it locally
1. Set the upstream remote (`git remote add upstream git@github.com:daytonn/jskit.git`)
1. Install the dependencies with npm (`npm install`)
1. Run the specs with `npm test`
1. Run the example app with `npm start`
1. Create your feature branch (`git checkout -b my-new-feature`)
1. Commit your changes (`git commit -am 'Add some feature'`)
1. Ensure remote is updated (`git remote update`)
1. Rebase from upstream (`git rebase upstream/master`)
1. Push to the branch (`git push origin my-new-feature`)
1. Create new Pull Request
