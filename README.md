JSkit
=====

[![npm version](https://badge.fury.io/js/jskit.svg)](http://badge.fury.io/js/jskit)

JSkit is a tiny library to end the problem of jQuery soup and `$(document).ready()` mess. JSkit introduces a simple, clean, and easily testable way to architect basic javascript enhanced web pages. Based on a simple event system, JSkit allows your back-end application to seamlessly integrate your javacsript code with minimal coupling.

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

### Using NPM

JSkit can be install using `npm`

```sh
npm install jskit
```

Or add it to your package.json:

```js
"jskit": "^3.5.0",
```

### Manual Install

* Download the latest version
  * [jskit-3.0.5.zip](https://github.com/daytonn/jskit/archive/3.5.0.zip)
* Include Script
  * include the `jskit.js` file in your application


```html
<script type="text/javascript" src="path/to/jskit.js"></script>
```

### Dependencies

* [lodash](https://lodash.com/) (or [underscore](http://underscorejs.org/))
* [jQuery](https://jquery.com/) (or equivalent `$` selector function)

Make sure that the dependencies are included and available globally.

```html
<script type="text/javascript" src="path/to/lodash.js"></script>
<script type="text/javascript" src="path/to/jquery.js"></script>
```

-- or --

```html
<script type="text/javascript" src="path/to/underscore.js"></script>
<script type="text/javascript" src="path/to/zepto.js"></script>
```


Basic Usage
-----------

### Application

A `JSkit.Application` object serves as the interface to your JSkit components. To create an application you simply call `JSkit.Application.create()`:

```js
var App = JSkit.Application.create();
```

### Dispatcher

Every application has a `Dispatcher` that allows you to register and trigger events throughout your JSkit application. In fact, JSkit is basically a thin wrapper around the `Dispatcher` that allows you to coordinate your javascript with minimal friction.

```js
App.Dispatcher.on("some-event-name", function() {
    // handle some-event-name
});

App.Dispatcher.trigger("some-event-name");
```

Generally you will not have to manually register for events (`App.Dispatcher.on`) since JSkit `Controllers` register their own actions automatically.

### Creating Controllers

The basic component of a JSkit application is a Controller. Controllers are basically objects that map events to methods (actions). To create a controller, call `createController`:

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

When the `Application` creates a controller, it handles passing the Application's dispatcher to the Controller, creating the Controller's factory, and creating a controller on the Application's `Controllers` object.

Controller objects are stored in `Application.Controllers` by name. Looking at the "Posts" controller example above we know that there is a Posts Controller object at `App.Controllers.Posts`.

Controller factories are functions on the `Application` object itself with the suffix "Controller". These factories are useful in testing to create fresh copies of the controller object for testing. Given the example above there would be a Posts controller factory at `App.PostsController`

 To create a Posts controller object, simply call create: 

```js
var testPostsController = App.PostsController.create();
```

The `App.Controllers.Posts` object is what the `Application` will use at runtime. The `App.PostsController` factory is simply a convenience for creating clean states for testing.

Controllers
-----------

### Actions

Actions define events to which your controller responds. The `Controller` uses the `actions` array to map its methods to the Dispatcher's events. Actions are automatically mapped to the Dispatcher when the `Controller` is created. There are two ways to define an action mapping:

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

When an action is mapped, it will be registered on the dispatcher for a specific event. The event that is registered depends on a few properties of the `Controller` which are: `namespace`, `channel`, `name`, and `action`. The default values for these are:

    namespace = ""
    channel = "controller"
    controllerEventName = "{Controller.name}" (lowercase and underscored)
    action = "{action}""
    eventSeperator = ":"

So using the above examples, the event maps for the `PostsController` are:

    controller:posts:foo  -> Controller.foo
    controller:posts:new  -> Controller.setupForm
    controller:posts:edit -> Controller.setupForm

*Note: undefined/empty values effectively removes that segment from the event name*


#### namespace

By default, Controller's have an empty namespace. If you wish to prefix the events with a namespace, set this property:

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

The default channel for a Controller is `controller`. To change this simply set the channel:

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

#### controller event name

The Controller is given a `name` property by the `Application.createController(name, attributes)` method. The controller event name is automatically created by lowercasing and underscoring the `name` to normalize event names. The `PostsController` example has the `name` "Posts" and a controller event name` of "posts". CamelCased names will have underscores between each uppercased word:

```js
App.createController("CamelCase", {...});
```

This would register all events with the controller controller event name of `camel_case`:

    controller:camel_case:action -> Controller.action

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

Testing
-------

JSkit is all about making testing javascript easier. When you create a controller with the `Application.createController` method. The created Controller's factory will be available on the `Application` object. Using the "Posts" controller example:

```js
App.PostsController.create();
```

**_ALWAYS_** use the provided factories when testing your Controllers to ensure you don't pollute your tests with mutated state.


Contributing
------------
1. [Fork it](https://github.com/daytonn/jskit/fork)
1. Clone it locally
1. Set the upstream remote (`git remote add upstream git@github.com:daytonn/jskit.git`)
1. Install the dependencies with npm (`npm install`)
1. Run the specs with `npm test`
1. Create your feature branch (`git checkout -b my-new-feature`)
1. Commit your changes (`git commit -am 'Add some feature'`)
1. Ensure remote is updated (`git remote update`)
1. Rebase from upstream (`git rebase upstream/master`)
1. Push to the branch (`git push origin my-new-feature`)
1. Create new Pull Request
