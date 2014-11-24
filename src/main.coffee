raf = require('raf')
now = require('performance-now')



# constants

MSQTY = {}
MSQTY.microseconds = 0.001
MSQTY.milliseconds = MSQTY.microseconds * 1000
MSQTY.seconds = MSQTY.milliseconds * 1000
MSQTY.minutes = MSQTY.seconds * 60
MSQTY.hours = MSQTY.minutes * 60
MSQTY.days = MSQTY.hours * 24

MEASURES = ['microseconds', 'milliseconds', 'seconds', 'minutes', 'hours', 'days']
TIMES = ['elapsed', 'clock']
COUNTS = ['start', 'stop', 'reset']
INFO = ['elapsed', 'clock', 'count']
CALLBACKS = ['when', 'every', 'while', 'during', 'beginning', 'ending']

ERRMSG =
  noArguments: 'No arguments supplied.'
  options:
    bad:
      oneArgument: 'Argument supplied is not a callback function or options object.'
      twoArguments: 'Arguments supplied are not a callback function followed by an options object.'
    step:
      missing: 'Options supplied are incomplete (no valid "step" function).'
      redundant: 'Options supplied are invalid (redundant "step" function).'
    pad:
      bad: 'Options supplied are invalid ("pad" option must have a false or integer value).'
  callback:
    bad: 'Callback supplied is not a function.'
    missing: 'No callback supplied.'
  startCallback:
    bad: 'Start callback is not a function.'
    missing: 'No start callback supplied.'
  endCallback:
    bad: 'End callback is not a function.'
    missing: 'No end callback supplied.'
  time:
    bad: 'Time supplied is not valid.'
  startTime:
    bad: 'Start time supplied is not valid.'
  endTime:
    bad: 'End time supplied is not valid.'
    missing: 'No end time supplied.'
  info:
    bad: 'Info supplied is not valid.'
  condition:
    bad: 'Condition callback is not a function.'
    missing: 'No condition callback supplied.'
  executionQty:
    bad: 'Execution quantity supplied is not an integer or Infinity.'
    missing: 'No execution quantity supplied.'

NOOP = ->



# library

class Lockstep

  #
  constructor: ->
    options = @_validateOptions(arguments)
    @settings = @_buildSettings(options)
    @running = false
    @microseconds = @_hasHighResolutionTime()
    @count =
      start: 0
      stop: 0
      reset: 0
    @time =
      running: 0 # length that timer has been running since last started
      stored: 0 # length that timer has run in the past, after last stopped
      last:
        start: null # latest timestamp when the timer was started
        stop: null # latest timestamp when the timer was stopped
        reset: null # latest timestamp when the time was reset
    @callbacks = []

  # shallow object merge
  #   see: http://stackoverflow.com/a/171256/167911
  _merge: (obj1, obj2) ->
    obj3 = {}
    obj3[name] = obj1[name] for name of obj1
    obj3[name] = obj2[name] for name of obj2
    obj3

  # pad integer with zeroes
  _pad: (int, length) ->
    int += '' # cast to string, if needed
    if int.length >= length # if the string is already long enough
      int
    else
      "#{new Array(length - int.length + 1).join('0')}#{int}"

  # determine variable type
  #   see: http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
  _type: (value) ->
    ({}).toString.call(value).match(/\s([a-zA-Z]+)/)[1].toLowerCase()

  # determine if a variable is an integer
  #   see: http://stackoverflow.com/a/14794066/167911
  _isInt: (value) ->
    not isNaN(value) and parseInt(Number(value)) is value and not isNaN(parseInt(value, 10))

  # determine if a variable is Infinity (exclude -Infinity)
  _isInf: (value) ->
    value is Number.POSITIVE_INFINITY

  # determine if an object is empty (has no properties of its own)
  _isEmpty: (obj) ->
    return false for own key of obj
    true

  # determine if high-resolution time is available
  _hasHighResolutionTime: ->
    window?.performance?.now? or process?.hrtime?

  # deep check validity of time object
  #  ex: { elapsed: { days: 1 } }
  _isValidTime: (time) ->
    if not @_type(time) is 'object' # isn't an object?
      return false
    oneTimeType = false
    for key, val of time
      if oneTimeType # already supplied one type of time?
        return false
      else
        oneTimeType = true # set flag
      if not (key in TIMES and @_type(val) is 'object') # doesn't have a certain property that's an object?
        return false
      for key2, val2 of val
        if not (key2 in MEASURES and @_type(val2) is 'number') # doesn't a certain property that's a number?
          return false
    true

  # deep check validity of count object
  #  ex: { start: 1 }
  _isValidCount: (count) ->
    for key, val of count
      if not (key in COUNTS and @_isInt(val)) # doesn't have a certain property that's an integer?
        return false
    true

  # deep check validity of info object
  #   ex: { elapsed: { days: 1 }, count: { start: 1 } }
  _isValidInfo: (info) ->
    time = {}
    for key, val of info
      if key in TIMES
        time[key] = val
      else if key is 'count'
        if not @_isValidCount(val) # isn't a valid count?
          return false
      else # doesn't have a certain property?
        return false
    if not @_isEmpty(time)
      if not @_isValidTime(time) # isn't a valid time?
        return false
    true

  #
  _validateOptions: (args) ->
    # check basic arguments
    if args.length is 0 # no arguments
      throw new Error(ERRMSG.noArguments)
    else if args.length is 1
      if @_type(args[0]) is 'function' # 'step' callback only
        options = { step: args[0] }
      else if @_type(args[0]) is 'object' # options object only
        if @_type(args[0].step) is 'function' # options object contains 'step' function
          options = args[0]
        else # no 'step' function
          throw new Error(ERRMSG.options.step.missing)
      else # bad argument
        throw new Error(ERRMSG.options.bad.oneArgument)
    else if args.length >= 2
      if @_type(args[0]) is 'object' and @_type(args[1]) is 'function' # options object & 'step' callback
        if args[0].step?
          throw new Error(ERRMSG.options.step.redundant)
        else
          args[0].step = args[1]
          options = args[0]
      else # bad arguments
        throw new Error(ERRMSG.options.bad.twoArguments)
    # check remaining options
    if options.pad?
      if not (options.pad is false or @_isInt(options.pad)) # "pad" option
        throw new Error(ERRMSG.options.pad.bad)
    options

  #
  _validateArguments: (argArray) ->
    for argInfo in argArray
      # shortcuts
      value = argInfo[0]
      validator = argInfo[1]
      errorMessageBad = argInfo[2]
      errorMessageMissing = argInfo[3]
      # validate
      if value?
        if @_type(validator) is 'function' # if this is a validator function
          if not validator(value)
            throw new Error(errorMessageBad)
        else if @_type(validator) is 'string' # if this is a type string
          switch validator
            when 'time' # time object
              if not @_isValidTime(value)
                throw new Error(errorMessageBad)
            when 'info' # info object
              if not @_isValidInfo(value)
                throw new Error(errorMessageBad)
            when 'count' # count object
              if not @_isValidCount(value)
                throw new Error(errorMessageBad)
            when 'executionQty'
              if not (@_isInt(value) or @_isInf(value))
                throw new Error(errorMessageBad)
            else
              if @_type(value) isnt validator # check standard data type
                throw new Error(errorMessageBad)
      else if errorMessageMissing? # no value, but it's required
        throw new Error(errorMessageMissing)
    return

  #
  _buildSettings: (options) ->
    defaults =
      pad: false # integer (or false); pads clock time output to a number of places (and results in a string)
      floor: false # boolean; removes decimal (via Math.floor) from elapsed time output
    @_merge(defaults, options)

  #
  _fireCallbacks: (info) ->
    for obj, i in @callbacks
      if obj.executionQty > 0 # if there are more executions left
        if obj.condition(info) # if it passes the condition test
          obj.callback(info) # run the callback
          obj.executionQty-- # decrement the execution quantity
      else
        @callbacks.splice(i, 1) # remove the callback

  #
  _runningTimeToElapsedTime: (runningTime) ->
    elapsedTime = {}
    if @microseconds
      elapsedTime.microseconds = runningTime / MSQTY.microseconds
      milliseconds = runningTime
    else
      milliseconds = runningTime
    elapsedTime.milliseconds = milliseconds
    elapsedTime.seconds = milliseconds / MSQTY.seconds
    elapsedTime.minutes = milliseconds / MSQTY.minutes
    elapsedTime.hours = milliseconds / MSQTY.hours
    elapsedTime.days = milliseconds / MSQTY.days
    elapsedTime

  #
  _runningTimeToClockTime: (runningTime) ->
    clockTime = {}
    if @microseconds
      clockTime.microseconds = Math.floor((runningTime % 1) / MSQTY.microseconds)
      milliseconds = Math.floor(runningTime)
    else
      milliseconds = runningTime
    clockTime.milliseconds = milliseconds % 1000
    clockTime.seconds = Math.floor(milliseconds / MSQTY.seconds) % 60
    clockTime.minutes = Math.floor(milliseconds / MSQTY.minutes) % 60
    clockTime.hours = Math.floor(milliseconds / MSQTY.hours) % 24
    clockTime.days = Math.floor(milliseconds / MSQTY.days)
    clockTime

  # convert the supplied elapsed time to running time
  _elapsedTimeToRunningTime: (elapsedTime) ->
    runningTime = 0 # protect against empty object supplied (e.g., elapsed: {})
    for key, val of elapsedTime
      runningTime = MSQTY[key] * val
    runningTime

  # convert the supplied clock time to running time
  _clockTimeToRunningTime: (clockTime) ->
    runningTime = 0 # protect against empty object supplied (e.g., clock: {})
    for key, val of clockTime
      runningTime += MSQTY[key] * val
    runningTime

  # convert the supplied time (when elapsed or clock is not known) to running time
  _toRunningTime: (time) ->
    if time.elapsed?
      return @_elapsedTimeToRunningTime(time.elapsed)
    else if time.clock?
      return @_clockTimeToRunningTime(time.clock)

  #
  _getInfo: ->
    totalTime = @time.stored + @time.running
    elapsed = @_runningTimeToElapsedTime(totalTime)
    clock = @_runningTimeToClockTime(totalTime)
    if @settings.floor
      elapsed = Math.floor(val) for key, val of elapsed
    if @settings.pad
      val = @_pad(val, @settings.pad) for key, val of clock
    {
      time: {
        elapsed
        clock
      }
      count: @count
    }

  #
  _adjustTime: (operation, runningTime) ->
    called = now()
    @time.last.start = called
    @time.running = 0
    switch operation
      when 'set'
        @time.stored = runningTime
      when 'add'
        @time.stored += runningTime
      when 'subtract'
        @time.stored -= runningTime
    if not @settings.allowNegative
      @time.stored = Math.max(@time.stored, 0)

  #
  _adjustCount: (operation, count) ->
    for key, val of count
      switch operation
        when 'set'
          @count[key] = val
        when 'add'
          @count[key] += val
        when 'subtract'
          @count[key] -= val
      if not @settings.allowNegative
        @count[key] = Math.max(@count[key], 0)
    return

  #
  _adjustInfo: (operation, info) ->
    if info.elapsed?
      @_adjustTime(operation, @_elapsedTimeToRunningTime(info.elapsed))
    if info.clock?
      @_adjustTime(operation, @_clockTimeToRunningTime(info.clock))
    if info.count?
      @_adjustCount(operation, info.count)

  #
  _loop: =>
    @pulse = raf(@_loop) # request next frame
    @_step()

  #
  # TODO: make sure order is correct, and no time accumulates while running code
  _step: (timeNow = now()) ->
    @time.running = timeNow - @time.last.start
    info = @_getInfo()
    @settings.step(info)
    @_fireCallbacks(info)

  #
  registerCallback: (executionQty, condition, callback) ->
    @_validateArguments [
      [executionQty, 'executionQty', ERRMSG.executionQty.bad, ERRMSG.noArguments]
      [condition, 'function', ERRMSG.condition.bad, ERRMSG.condition.missing]
      [callback, 'function', ERRMSG.callback.bad, ERRMSG.callback.missing]
    ]
    @callbacks.push {
      executionQty
      condition
      callback
    }

  #
  start: (callback = @settings.start) ->
    called = now()
    @_validateArguments [
      [callback, 'function', ERRMSG.callback.bad]
    ]
    if not @running
      @count.start++
      @running = true
      @time.last.start = called # set start timestamp
      @_loop()
      callback?(@_getInfo()) # TODO: ensure that info is time-accurate
    this

  #
  stop: (callback = @settings.stop) ->
    called = now()
    @_validateArguments [
      [callback, 'function', ERRMSG.callback.bad]
    ]
    if @running
      raf.cancel(@pulse)
      @count.stop++
      @running = false
      @time.last.stop = called # set stop timestamp
      @_step(called) # final step
      @time.stored += @time.running
      @time.running = 0
      callback?(@_getInfo()) # TODO: ensure that info is time-accurate
    this

  #
  reset: (callback = @settings.reset, count) ->
    called = now()
    @_validateArguments [
      [callback, 'function', ERRMSG.callback.bad]
    ]
    if @time.running > 0 or @time.stored > 0
      callbackEligible = true
      @time.running = @time.stored = 0
      @count.reset++
      @time.last.reset = @time.last.start = called # set start & reset timestamps
      @time.last.stop = null
    if count # then if any counts are greater than 0, reset all
      for key, val of @count
        if val > 0
          callbackEligible = true
          @count.start = 0
          @count.stop = 0
          @count.reset = 0
          break
    callbackEligible and callback?(@_getInfo()) # TODO: ensure that info is time-accurate
    this

  #
  info: (info, callback = @settings.info) ->
    if info? # setter
      @_validateArguments [
        [info, 'info', ERRMSG.info.bad, ERRMSG.noArguments]
        [callback, 'function', ERRMSG.callback.bad]
      ]
      @_adjustInfo('set', info)
      callback?(@_getInfo()) # TODO: ensure that info is time-accurate
      return this
    else # getter
      @_getInfo()

  #
  add: (info, callback = @settings.add) ->
    @_validateArguments [
      [info, 'info', ERRMSG.info.bad, ERRMSG.noArguments]
      [callback, 'function', ERRMSG.callback.bad]
    ]
    @_adjustInfo('add', info)
    callback?(@_getInfo()) # TODO: ensure that info is time-accurate
    this

  #
  subtract: (info, callback = @settings.subtract) ->
    @_validateArguments [
      [info, 'info', ERRMSG.info.bad, ERRMSG.noArguments]
      [callback, 'function', ERRMSG.callback.bad]
    ]
    @_adjustInfo('subtract', info)
    callback?(@_getInfo()) # TODO: ensure that info is time-accurate
    this

  # run callback at a specific time
  when: (time, callback = @settings.when) ->
    @_validateArguments [
      [time, 'time', ERRMSG.time.bad, ERRMSG.noArguments]
      [callback, 'function', ERRMSG.callback.bad, ERRMSG.callback.missing]
    ]
    @registerCallback(1, (info) =>
      @_elapsedTimeToRunningTime(info.time.elapsed) >= @_toRunningTime(time)
    , callback)
    this

  # run callback at a specified time interval
  # TODO: use @when()
  every: (time, callback = @settings.every) ->
    @_validateArguments [
      [time, 'time', ERRMSG.time.bad, ERRMSG.noArguments]
      [callback, 'function', ERRMSG.callback.bad, ERRMSG.callback.missing]
    ]
    this

  # run callback on each step through a specified time period
  # TODO: use @when()
  while: (startTime, endTime, callback = @settings.while) ->
    @_validateArguments [
      [startTime, 'time', ERRMSG.startTime.bad, ERRMSG.noArguments]
      [endTime, 'time', ERRMSG.endTime.bad, ERRMSG.endTime.missing]
      [callback, 'function', ERRMSG.callback.bad, ERRMSG.callback.missing]
    ]
    @registerCallback(Infinity, (info) =>
      @_toRunningTime(startTime) <= @_elapsedTimeToRunningTime(info.time.elapsed) <= @_toRunningTime(endTime)
    , callback)
    this

  # run callback at the beginning of a specified time period, and another callback at the end
  # TODO: use @when()
  during: (startTime, endTime, startCallback = @settings.duringStart, endCallback = @settings.duringEnd) ->
    @_validateArguments [
      [startTime, 'time', ERRMSG.startTime.bad, ERRMSG.noArguments]
      [endTime, 'time', ERRMSG.endTime.bad, ERRMSG.endTime.missing]
      [startCallback, 'function', ERRMSG.startCallback.bad, ERRMSG.startCallback.missing]
      [endCallback, 'function', ERRMSG.endCallback.bad, ERRMSG.endCallback.missing]
    ]
    this

  #
  # TODO: use @during() with an infinity endTime
  beginning: (startTime, startCallback = @settings.beginning) ->
    @_validateArguments [
      [startTime, 'time', ERRMSG.startTime.bad, ERRMSG.noArguments]
      [startCallback, 'function', ERRMSG.startCallback.bad, ERRMSG.startCallback.missing]
    ]
    @during(startTime, Infinity, startCallback, NOOP)
    this

  #
  # TODO: use @during() with a zero startTime
  ending: (endTime, endCallback = @settings.ending) ->
    @_validateArguments [
      [endTime, 'time', ERRMSG.time.bad, ERRMSG.noArguments]
      [endCallback, 'function', ERRMSG.endCallback.bad, ERRMSG.endCallback.missing]
    ]
    this



# expose

module.exports = Lockstep
