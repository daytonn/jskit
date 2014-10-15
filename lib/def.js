/* jshint esnext: true */
export default function(constructor, propertyName, value, writeable = true, configurable = true, enumerable = true) {
  Object.defineProperty(constructor.prototype, propertyName, {
    writeable: writeable,
    configurable: configurable,
    enumerable: enumerable,
    value: value
  });
}
