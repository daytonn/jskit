// ES5 15.2.3.5 Object.create ( O [, Properties] )
if (typeof Object.create !== "function") {
  Object.create = function (prototype, properties) {
    if (typeof prototype !== "object") { throw new Error("Object.create(prototype, properties): prototype is not an Object"); }
    function Ctor() {}
    Ctor.prototype = prototype;
    var o = new Ctor();
    if (prototype) { o.constructor = Ctor; }
    if (properties !== undefined) {
      if (properties !== Object(properties)) { throw new Error("Object.create(prototype, properties): properties is not an Object"); }
      Object.defineProperties(o, properties);
    }
    return o;
  };
}

// ES 15.2.3.6 Object.defineProperty ( O, P, Attributes )
// Partial support for most common case - getters, setters, and values
(function() {
  if (!Object.defineProperty ||
      !(function () { try { Object.defineProperty({}, "x", {}); return true; } catch (e) { return false; } } ())) {
    var orig = Object.defineProperty;
    Object.defineProperty = function (o, prop, desc) {
      // In IE8 try built-in implementation for defining properties on DOM prototypes.
      if (orig) { try { return orig(o, prop, desc); } catch (e) {} }

      if (o !== Object(o)) { throw new Error("Object.defineProperty called on non-object"); }
      if (Object.prototype.__defineGetter__ && ("get" in desc)) {
        Object.prototype.__defineGetter__.call(o, prop, desc.get);
      }
      if (Object.prototype.__defineSetter__ && ("set" in desc)) {
        Object.prototype.__defineSetter__.call(o, prop, desc.set);
      }
      if ("value" in desc) {
        o[prop] = desc.value;
      }
      return o;
    };
  }
}());

/**
  Return the given property or a default value.

  @private
  @method setDefault
  @param property {*} Variable to return unless it's undefined
  @param defaultValue {*} Value to return if property is undefined
  @return {*}
*/
function setDefault(property, defaultValue) {
  if (typeof property === "undefined") {
    return defaultValue;
  } else {
    return property;
  }
}

/**
  Define a property on a given constructor's prototype
  with the given name and value. You can optionally set
  the writeable, configurable, and enumerable values.

  @method def
  @param constructor {Object} Constructor to define a property on
  @param propertyName {String} Name of the property to define
  @param value {*} Value of the property
  @param writeable {Boolean} override the default writeable value (false)
  @param configurable {Boolean} override the default configurable value (false)
  @param enumerable {Boolean} override the default enumerable value (false)
*/
module.exports = function(constructor, propertyName, value, writeable, configurable, enumerable) {
  writeable = setDefault(writeable, false);
  configurable = setDefault(configurable, false);
  enumerable = setDefault(enumerable, false);

  Object.defineProperty(constructor.prototype, propertyName, {
    writeable: writeable,
    configurable: configurable,
    enumerable: enumerable,
    value: value
  });
};
