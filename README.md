JSKit
=====

JSKit is a tiny library to end the problem of jQuery soup and `$(document).ready()` mess. JSKit introduces a simple, clean, and easily testable way to architect basic javascript enhanced web pages.

Getting Started
---------------

### Download
Download the latest version here: [https://github.com/daytonn/jskit/releases](https://github.com/daytonn/jskit/releases).

### Include Script
Simply include the `dist/jskit.js` file in your application:

```html
<script type="text/javascript" src="path/to/jskit.js"></script>
```

### Create Application
Create the application object:

```js
var App = JSKit.createApplication();
```

### Make A Controller
A Controller object generally controlls a group of related actions/pages via triggered events on the Application's Dispatcher.

```js
App.createController("Tasks", {
	actions: ["index", "edit", "new"],
	
	index: function(data) {
		// index page functionality
	},
	
	edit: function() {
		// edit page functionality
	},
	
	new: function() {
		// new page functionality
	}
});
```

With this contrived Task Controller we can manage all the pages that deal with tasks. We simply have to trigger the action on the page when it loads. This can typically be done programatically from the back-end.

```js
App.Dispatcher.trigger("controller:tasks:index", data);
```

This pattern allows us to be explicit without tightly coupling our backend to the client-side code. All the backend needs to know is that there is an `App` global with a `Dispatcher` that can emit events with the form of `"controller:[name]:[action]"`. The event triggerer does not need to know anything about the controller(s) which responds to the event or even if anything does respond to the event. Your client side code can hapilly change and grow without needing to affect your templates.

Not only that, but this pattern is infinitely more testable than your run of the mill `$(document).ready` soup:

```
describe("SomeController", function() {
	var subject;
	beforeEach(function() {
		subject = App.Controller.SomeController;
	});
	
	it("does some cool stuff", function() {
		expect(subject.doCoolStuff()).to.be("Cool");
	});
});
```