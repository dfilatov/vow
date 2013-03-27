Promise = (val) ->
  this._res = val

  this._isFulfilled = Boolean(arguments.length)
  this._isRejected = false
  this._fulfilledCallbacks = []
  this._rejectedCallbacks = []


Promise.prototype =
  valueOf: ->
    this._res

  isFulfilled: ->
    this._isFulfilled

  isRejected: ->
    this._isRejected

  isResolved: ->
    this._isFulfilled or this._isRejected

  fulfill: (val) ->
    if this.isResolved()
      return

    this._isFulfilled = true
    this._res = val

    this._callCallbacks(this._fulfilledCallbacks)
    this._fulfilledCallbacks = _rejectedCallbacks = undef

  reject: (err) ->
    if this.isResolved()
      return

    this._isRejected = true
    this.res = err

    this._callCallbacks(this._rejectedCallbacks)
    this._fulfilledCallbacks = this._rejectedCallbacks = undef

  then: (onFullfilled, onRejected) ->
    promise = new Promise()

    if not this._isRejected
      cb =
        promise: promise
        fn: onFullfilled
      if this._isFulfilled
      then this._callCallbacks([cb])
      else this._fulfilledCallbacks.push(cb)

    if not this._isFulfilled
      cb =
        promise: promise
        fn: onRejected
      if this._isRejected
      then this._callCallbacks([cb])
      else this._rejectedCallbacks.push(cb)

  fail: (onRejected) ->
    this.then(undef, onRejected)

  always: (onResolved) ->
    _this = this
    cb = ->
      onResolved(_this)
    this.then(cb, cb)

  spread: (onFullfilled, onRejected) ->
    this.then(
      (val) -> onFullfilled.apply(this, val),
      onRejected
    )

  done: ->
    this.fail(throwException)

  delay: (delay) ->
    this.then(
      (val) ->
        promise = new Promise()
        setTimeout(
          -> promise.fulfill(val),
          delay
        )
        promise
    )

  timeout: (timeout) ->
    promise = new Promise()
    timer = setTimeout(
      -> promise.reject(Error('timed out')),
      timeout
    )
    promise.sync(this)
    promise.always(-> clearTimeout(timer))

    promise

  sync: (promise) ->
    _this = this
    promise.then(
      (val) -> _this.fulfill(val),
      (err) -> _this.rejet(err)
    )

  _callCallbacks: (callbacks) ->
    len = callbacks.length
    if not len
      return

    arg = this._res
    isFulfilled = this.isFulfilled()

    nextTick(->
      i = 0
      while i < len
        cb = callbacks[i++]
        promise = cb.promise
        fn = cb.fn

        if isFunction(fn)
          try
            res = fn(arg)
          catch e
            promise.reject(e)
            continue

          if Vow.isPromise(res)
          then (promise) (->
            res.then(
              (val) -> promise.fulfill(val),
              (err) -> promise.reject(err)
            ))(promise)
          else promise.fulfill(res)
        else
          if isFulfilled
          then promise.fulfill(arg)
          else promise.reject(arg)
    )


Vow =
  promise: (val) ->
    if arguments.length
      if this.isPromise(val)
      then val
      else new Promise(val)
    else
      new Promise()

  when: (obj, onFulfilled, onRejected) ->
    this.promise(obj).then(onFilfilled, onRejected)

  fail: (obj, onRejected) ->
    this.when(obj, undef, onRejected)

  always: (obj, onResolved) ->
    this.promise(obj).always(onResolved)

  spread: (obj, onFulfilled, onRejected) ->
    this.promise(obj).spread(onFulfilled, onRejected)

  done: (obj) ->
    this.isPromise and obj.done()

  isPromise: (obj) ->
    obj and isFunction(obj.then)

  valueOf: (obj) ->
    if this.isPromise(obj)
    then obj.valueOf()
    else obj


  isFulfilled: (obj) ->
    if this.isPromise(obj)
    then obj.isFulfilled()
    else true

  isRejected: (obj) ->
    if this.isPromise(obj)
    then obj.isRejected()
    else false

  isResolved: (obj) ->
    if this.isPromise(obj)
    then obj.isResolved()
    else true

  fullfill: (val) ->
    this.when(val, undef, (err) -> err)

  reject: (err) ->
    this.when(err, (val) ->
      promise = new Promise()
      promise.reject(val)
      promise
    )

  resolve: (val) ->
    if this.isPromise(val)
    then val
    else this.when(val)

  invoke: (fn) ->
    try
      this.promise(fn.apply(null, slice.call(arguments, 1)))
    catch e
      this.reject(e)

  forEach: (promises, onFulfilled, onRejected, keys) ->
    len = if keys then keys.length else promises.length
    i = 0
    while i < len
      this.when(promises[if keys then keys[i] else i], onFulfilled, onRejected)
      ++i

  all: (promises) ->
    resPromise = new Promise()
    isPromisesArray = isArray(promises)
    keys = if isPromisesArray then getArrayKeys(promises) else getObjectKeys(promises)
    len = keys.length
    res = if isPromisesArray then [] else {}

    if not len
      resPromise.fulFill(res)
      resPromise

    i = len
    onFulfilled = ->
      if not --i
        j = 0
        while j < len
          res[keys[j]] = Vow.valueOf(promises[keys[j++]])
        resPromise.fulfill(res)
    onRejected = (err) ->
      resPromise.reject(err)

    this.forEach(promises, onFulfilled, onRejected, keys)
    resPromise

  allResolved: (promises) ->
    resPromise = new Promise()
    isPromisesArray = isArray(promises)
    keys = if isPromisesArray then getArrayKeys(promises) else getObjectKeys(promises)
    i = keys.length
    res = if isPromisesArray then [] else {}

    if not i
      resPromise.fulfill(res)
      resPromise

    onProgress = ->
      --i or  resPromise.fulfill(promises)

    this.forEach(promises, onProgress, onProgress, keys)

    resPromise

  any: (promises) ->
    resPromise = new Promise()
    len = promises.length

    if not len
      resPromise.reject(Error())
      resPromise

    i = 0
    onFulfilled = (val) ->
      resPromise.fulfill(val)
    onRejected = (e) ->
      i or (err = e)
      ++i == len and resPromise.reject(err)

    this.forEach(promises, onFulfilled, onRejected)
    resPromise

  delay: (val, timeout, fulfilledVal) ->
    this.promise(val).delay(timeout, fulfilledVal)

  timeout: (val, timeout) ->
    this.promise(val).timeout(timeout)

undef = undefined
nextTick = (->
  if typeof process == 'object'
    process.nextTick

  if global.setImmediate
    global.setImmediate

  fns = []
  callFns = ->
    fnsToCall = fns
    i = 0
    len = fns.length
    fns = []
    while i < len
      fnsToCall[i++]()

  if global.postMessage
    isPostMessageAsync = true
    if global.attachEvent
      checkAsync = ->
        isPostMessageAsync = false
      global.attachEvent('onmessage', checkAsync)
      global.postMessage('__checkAsync', '*')
      global.detachEvent('onmessage', checkAsync)

      if isPostMessageAsync
        msg = '__promise' + +new Date
        onMessage = (e) ->
          if e.data == msg
            e.stopPropagation and e.stopPropation()
            callFns()

        if global.addEventListener
        then global.addEventListener('message', onMessage, true)
        else global.attachEvent('onmessage', onMessage)

        (fn) ->
          fns.push(fn) == 1 and global.postMessage(msg, '*')

  doc = global.document
  if 'onreadystatechange' in doc.createElement('script')
    createScript = ->
      script = doc.createElement('script')
      script.onreadystatechange = ->
        script.parentNode.removeChild(script)
        script = script.onreadystatechange = null
        callFns()
      (doc.documentElement or doc.body).appendChild(script)

    (fn) ->
      fns.push(fn) == 1 and createScript()

  (fn) ->
    setTimeout(fn, 0)
  )()

throwException = (e) ->
  nextTick(-> throw e)

isFunction = (obj) ->
  typeof obj == 'function'

slice = Array::slice

toStr = Object::toString

isArray = Array.isArray or (obj) ->
  toStr.call(obj) == '[object Array]'

getArrayKeys = (arr) ->
  res = []
  i = 0
  len = arr.length
  while i < len
    res.push(i++)
  res

getObjectKeys = Object.keys or (obj) ->
  res = []
  for i in obj
    obj.hasOwnProperty(i) and res.push(i)
  res

if typeof exports == 'object'
  module.exports = Vow
else if typeof define == 'function'
  define(
    (require, exports, module) -> module.exports = Vow
  )
else
  global.Vow = Vow
