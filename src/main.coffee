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



# library

class Lockstep

  #
  constructor: ->
    options = @_checkArguments(arguments)
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
      "#{new Array(length - int.length + 1).join('0')}int"

  #
  _hasHighResolutionTime: ->
    window?.performance?.now? or process?.hrtime?

  #
  _checkArguments: (args) ->
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
    return

  #
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
        else
          throw new Error('Bad arguments supplied (count value is not an integer).')
      else
        throw new Error('Bad arguments supplied (wrong property).')
    return

  #
  _adjustInfo: (operation, info) ->
    if @_type(info) is 'object'
      if info.elapsed? and info.clock?
        throw new Error('Bad arguments supplied (both elapsed and clock times).')
      if info.elapsed?
        @_adjustRunTime(operation, @_elapsedTimeToRunTime(info.elapsed))
      if info.clock?
        @_adjustRunTime(operation, @_clockTimeToRunTime(info.clock))
      if info.count?
        @_adjustCount(operation, info.count)
    else
      throw new Error('Bad arguments supplied (wrong type).')

  #
  _loop: =>
    @pulse = raf(@_loop) # request next frame
    @_step()

  #
  _step: ->
    @settings.step(@_getInfo())

  #
  start: (callback = @settings.start) ->
    if not @running
      @count.start++
      @running = true
      @time.start = now() # set start timestamp
      @_loop()
      callback?(@_getInfo()) # TODO: ensure that info is time-accurate
    this

  #
  stop: (callback = @settings.stop) ->
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
    if callback? and callbackEligible
      if @_type(callback) is 'function'
        callback?(@_getInfo()) # TODO: ensure that info is time-accurate
      else
        throw new Error('Bad arguments supplied (wrong type).')
    this

  #
  info: (info, callback = @settings.info) ->
    if info? # setter
      @_adjustInfo('set', info)
      callback?(@_getInfo()) # TODO: ensure that info is time-accurate
      return this
    else # getter
      @_getInfo()

  #
  add: (info, callback = @settings.add) ->
    if info?
      @_adjustInfo('add', info)
      callback?(@_getInfo()) # TODO: ensure that info is time-accurate
      return this
    else
      throw new Error('No arguments supplied.')

  #
  subtract: (info, callback = @settings.subtract) ->
    if info?
      @_adjustInfo('subtract', info)
      callback?(@_getInfo()) # TODO: ensure that info is time-accurate
      return this
    else
      throw new Error('No arguments supplied.')

  # # run callback at a specific time
  # when: (time, callback) ->
  #   this
  #
  # # run callback at a specified time interval
  # # TODO: use @when()
  # every: (time, callback) ->
  #   this
  #
  # # run callback on each step through a specified time period
  # # TODO: use @when()
  # while: (startTime, endTime, callback) ->
  #   this
  #
  # # run callback at the beginning of a specified time period, and another callback at the end
  # # TODO: use @when()
  # during: (startTime, endTime, startCallback, endCallback) ->
  #   this
  #
  # #
  # # TODO: use @during() with an infinity endTime
  # beginning: (startTime, startCallback) ->
  #   @during(startTime, Infinity, startCallback, NOOP)
  #   this
  #
  # #
  # # TODO: use @during() with a zero startTime
  # ending: (endTime, endCallback) ->
  #   this



# expose

module.exports = Lockstep
