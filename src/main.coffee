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

NOOP = ->

MEASURES = ['microseconds', 'milliseconds', 'seconds', 'minutes', 'hours', 'days']
TIMES = ['elapsed', 'clock']
COUNTS = ['start', 'stop', 'reset']
INFO = ['elapsed', 'clock', 'count']



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
      start: null # latest timestamp when the timer was started
      stop: null # latest timestamp when the timer was stopped
      run: 0 # length that timer has run

  # determine variable type
  #   see: http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
  _type: (value) ->
    ({}).toString.call(value).match(/\s([a-zA-Z]+)/)[1].toLowerCase()

  # determine if a variable is an integer
  #   see: http://stackoverflow.com/a/14794066/167911
  _isInt: (value) ->
    not isNaN(value) and parseInt(Number(value)) is value and not isNaN(parseInt(value, 10))

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

  #
  _hasHighResolutionTime: ->
    window?.performance?.now? or process?.hrtime?

  # deep check validity of time object
  _isValidTime: (time) ->
    oneTimeType = false
    if not @_type(time) is 'object' # isn't an object?
      return false
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
  _isValidCount: (count) ->
    for key, val of count
      if not (key in COUNTS and @_isInt(val)) # doesn't have a certain property that's an integer?
        return false
    true

  # deep check validity of info object
  _isValidInfo: (info) ->
    for key, val of info
      if key in TIMES
        if not @_isValidTime(val) # isn't a valid time?
          return false
      else if key is 'count'
        if not @_isValidCount(val) # isn't a valid count?
          return false
      else # doesn't have a certain property?
        return false
    true

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
            else
              if @_type(value) isnt validator # check standard data type
                throw new Error(errorMessageBad)
      else if errorMessageMissing? # no value, but it's required
        throw new Error(errorMessageMissing)

  #
  _validateOptions: (args) ->
    # check basic arguments
    if args.length is 0 # no arguments
      throw new Error('No arguments supplied.')
    else if args.length is 1
      if @_type(args[0]) is 'function' # 'step' callback only
        options = { step: args[0] }
      else if @_type(args[0]) is 'object' # options object only
        if @_type(args[0].step) is 'function' # options object contains 'step' function
          options = args[0]
        else # no 'step' function
          throw new Error('Bad arguments supplied (no valid "step" function).')
      else # bad arguments
        throw new Error('Bad arguments supplied (wrong type).')
    else if args.length >= 2
      if @_type(args[0]) is 'object' and @_type(args[1]) is 'function' # options object & 'step' callback
        if args[0].step?
          throw new Error('Bad arguments supplied (redundant "step" function).')
        else
          args[0].step = args[1]
          options = args[0]
      else # bad arguments
        throw new Error('Bad arguments supplied (wrong type).')
    # check remaining options
    if options.pad?
      if not (options.pad is false or @_isInt(options.pad)) # "pad" option
        throw new Error('Bad arguments supplied ("pad" option must have a false or integer value).')
    options

  #
  _buildSettings: (options) ->
    defaults =
      pad: false # integer (or false); pads clock time output to a number of places (and results in a string)
      floor: false # boolean; removes decimal (via Math.floor) from elapsed time output
    @_merge(defaults, options)

  #
  _runTimeToClockTime: (runTime) ->
    clockTime = {}
    if @microseconds
      clockTime.microseconds = Math.floor((runTime % 1) / MSQTY.microseconds)
      milliseconds = Math.floor(runTime)
    else
      milliseconds = runTime
    clockTime.milliseconds = milliseconds % 1000
    clockTime.seconds = Math.floor(milliseconds / MSQTY.seconds) % 60
    clockTime.minutes = Math.floor(milliseconds / MSQTY.minutes) % 60
    clockTime.hours = Math.floor(milliseconds / MSQTY.hours) % 24
    clockTime.days = Math.floor(milliseconds / MSQTY.days)
    clockTime

  #
  _runTimeToElapsedTime: (runTime) ->
    elapsedTime = {}
    if @microseconds
      elapsedTime.microseconds = runTime / MSQTY.microseconds
      milliseconds = runTime
    else
      milliseconds = runTime
    elapsedTime.milliseconds = milliseconds
    elapsedTime.seconds = milliseconds / MSQTY.seconds
    elapsedTime.minutes = milliseconds / MSQTY.minutes
    elapsedTime.hours = milliseconds / MSQTY.hours
    elapsedTime.days = milliseconds / MSQTY.days
    elapsedTime

  #
  _elapsedTimeToRunTime: (elapsedTime) ->
    propQty = 0
    runTime = 0 # protect against empty object supplied (e.g., elapsed: {})
    for key, val of elapsedTime
      if ++propQty > 1
        throw new Error('Bad arguments supplied (too many properties).')
      if key in MEASURES
        runTime = MSQTY[key] * val
      else
        throw new Error('Bad arguments supplied (wrong property).')
    runTime

  #
  _clockTimeToRunTime: (clockTime) ->
    runTime = 0
    for key, val of clockTime
      if key in MEASURES
        runTime += MSQTY[key] * val
      else
        throw new Error('Bad arguments supplied (wrong property).')
    runTime

  #
  _getInfo: ->
    runTime = if @running # timer is currently running
      @time.run + now() - @time.start
    else # timer is stopped, or has never run
      @time.run
    elapsed = @_runTimeToElapsedTime(runTime)
    clock = @_runTimeToClockTime(runTime)
    if @settings.floor then elapsed = Math.floor(val) for key, val of elapsed
    if @settings.pad then val = @_pad(val, @settings.pad) for key, val of clock
    {
      time: {
        elapsed
        clock
      }
      count: @count
    }

  #
  _adjustRunTime: (operation, runTime) ->
    switch operation
      when 'set'
        @time.run = runTime
      when 'add'
        @time.run += runTime
      when 'subtract'
        @time.run -= runTime
      else
        throw new Error('Bad arguments supplied (invalid operation).')
    if not @settings.allowNegative
      @time.run = Math.max(@time.run, 0)

  #
  # TODO: new validation (work upward)
  _adjustCount: (operation, count) ->
    for key, val of count
      if key in ['start', 'stop', 'reset']
        if @_isInt(val)
          switch operation
            when 'set'
              @count[key] = val
            when 'add'
              @count[key] += val
            when 'subtract'
              @count[key] -= val
            else
              throw new Error('Bad arguments supplied (invalid operation).')
          if not @settings.allowNegative
            @count[key] = Math.max(@count[key], 0)
        else
          throw new Error('Bad arguments supplied (count value is not an integer).')
      else
        throw new Error('Bad arguments supplied (wrong property).')
    return

  #
  _adjustInfo: (operation, info) ->
    if info.elapsed?
      @_adjustRunTime(operation, @_elapsedTimeToRunTime(info.elapsed))
    if info.clock?
      @_adjustRunTime(operation, @_clockTimeToRunTime(info.clock))
    if info.count?
      @_adjustCount(operation, info.count)

  #
  _loop: =>
    @pulse = raf(@_loop) # request next frame
    @_step()

  #
  _step: ->
    @settings.step(@_getInfo())

  #
  start: (callback = @settings.start) ->
    @_validateArguments [
      [callback, 'function', 'Callback supplied is not a function.']
    ]
    if not @running
      @count.start++
      @running = true
      @time.start = now() # set start timestamp
      @_loop()
      callback?(@_getInfo()) # TODO: ensure that info is time-accurate
    this

  #
  stop: (callback = @settings.stop) ->
    @_validateArguments [
      [callback, 'function', 'Callback supplied is not a function.']
    ]
    if @running
      raf.cancel(@pulse)
      @time.stop = now() # set stop timestamp
      @time.run += @time.stop - @time.start # add run time
      @count.stop++
      @running = false
      @_step() # final step
      callback?(@_getInfo()) # TODO: ensure that info is time-accurate
    this

  #
  reset: (callback = @settings.reset, count) ->
    @_validateArguments [
      [callback, 'function', 'Callback supplied is not a function.']
    ]
    if @time.run > 0
      callbackEligible = true
      @time.run = 0
      @count.reset++
      @time.start = now() # set start timestamp
      @time.stop = null
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
        [info, 'info', 'Info supplied is not valid.', 'No arguments supplied.']
        [callback, 'function', 'Callback supplied is not a function.']
      ]
      @_adjustInfo('set', info)
      callback?(@_getInfo()) # TODO: ensure that info is time-accurate
      return this
    else # getter
      @_getInfo()

  #
  add: (info, callback = @settings.add) ->
    @_validateArguments [
      [info, 'info', 'Info supplied is not valid.', 'No arguments supplied.']
      [callback, 'function', 'Callback supplied is not a function.']
    ]
    @_adjustInfo('add', info)
    callback?(@_getInfo()) # TODO: ensure that info is time-accurate
    this

  #
  subtract: (info, callback = @settings.subtract) ->
    @_validateArguments [
      [info, 'info', 'Info supplied is not valid.', 'No arguments supplied.']
      [callback, 'function', 'Callback supplied is not a function.']
    ]
    @_adjustInfo('subtract', info)
    callback?(@_getInfo()) # TODO: ensure that info is time-accurate
    this

  # run callback at a specific time
  when: (time, callback = @settings.when) ->
    @_validateArguments [
      [time, 'time', 'Time supplied is not valid.', 'No arguments supplied.']
      [callback, 'function', 'Callback supplied is not a function.', 'No callback supplied.']
    ]
    this

  # run callback at a specified time interval
  # TODO: use @when()
  every: (time, callback = @settings.every) ->
    @_validateArguments [
      [time, 'time', 'Time supplied is not valid.', 'No arguments supplied.']
      [callback, 'function', 'Callback supplied is not a function.', 'No callback supplied.']
    ]
    this

  # run callback on each step through a specified time period
  # TODO: use @when()
  while: (startTime, endTime, callback = @settings.while) ->
    @_validateArguments [
      [startTime, 'time', 'Start time supplied is not valid.', 'No arguments supplied.']
      [endTime, 'time', 'End time supplied is not valid.', 'No end time supplied.']
      [callback, 'function', 'Callback supplied is not a function.', 'No callback supplied.']
    ]
    this

  # run callback at the beginning of a specified time period, and another callback at the end
  # TODO: use @when()
  during: (startTime, endTime, startCallback = @settings.duringStart, endCallback = @settings.duringEnd) ->
    @_validateArguments [
      [startTime, 'time', 'Start time supplied is not valid.', 'No arguments supplied.']
      [endTime, 'time', 'End time supplied is not valid.', 'No end time supplied.']
      [startCallback, 'function', 'Start callback is not a function.', 'No start callback supplied.']
      [endCallback, 'function', 'End callback is not a function', 'No end callback supplied.']
    ]
    this

  #
  # TODO: use @during() with an infinity endTime
  beginning: (startTime, startCallback = @settings.beginning) ->
    @_validateArguments [
      [startTime, 'time', 'Start time supplied is not valid.', 'No arguments supplied.']
      [startCallback, 'function', 'Start callback is not a function.', 'No start callback supplied.']
    ]
    @during(startTime, Infinity, startCallback, NOOP)
    this

  #
  # TODO: use @during() with a zero startTime
  ending: (endTime, endCallback = @settings.ending) ->
    @_validateArguments [
      [endTime, 'time', 'Time supplied is not valid.', 'No arguments supplied.']
      [endCallback, 'function', 'End callback is not a function.', 'No end callback supplied.']
    ]
    this



# expose

module.exports = Lockstep
