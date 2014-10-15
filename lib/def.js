/* jshint esnext: true */
function setDefault(property, defaultValue) {
  if (typeof property === "undefined") {
    return defaultValue;
  } else {
    return property;
  }
}

export default function(constructor, propertyName, value, writeable, configurable, enumerable) {
  writeable = setDefault(writeable, false);
  configurable = setDefault(configurable, false);
  enumerable = setDefault(enumerable, false);

  Object.defineProperty(constructor.prototype, propertyName, {
    writeable: writeable,
    configurable: configurable,
    enumerable: enumerable,
    value: value
  });
}
