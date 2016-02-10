export function spy() {
  var calls = []
  var count = 0

  function fn() {
    this.calls = calls.push(arguments)
    this.count = count += 1
    this.called = true
  }

  return new fn
}

export function spyOn(obj, method) {
  const func = obj[method]
  return obj[method] = function() {
    const count = func.callCount || 0
    func.callCount = count + 1
    func.calls = func.calls || []
    func.called = true
    func.calls.push(Array.prototype.slice.call(arguments, 0))
    return func.apply(obj, arguments)
  }
}
