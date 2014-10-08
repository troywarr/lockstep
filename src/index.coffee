# constants

MSQTY = {}
MSQTY.milliseconds = 1
MSQTY.seconds = 1000
MSQTY.minutes = MSQTY.seconds * 60
MSQTY.hours = MSQTY.minutes * 60
MSQTY.days = MSQTY.hours * 24

noop = ->



# utilities

# determine variable type
#   see: http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
type = (value) ->
  ({}).toString.call(value).match(/\s([a-zA-Z]+)/)[1].toLowerCase()

# determine if a variable is an integer
#   see: http://stackoverflow.com/a/14794066/167911
isInt = (value) ->
  not isNaN(value) and parseInt(Number(value)) is value and not isNaN(parseInt(value, 10))

# shallow object merge
#   see: http://stackoverflow.com/a/171256/167911
merge = (obj1, obj2) ->
  obj3 = {}
  obj3[name] = obj1[name] for name of obj1
  obj3[name] = obj2[name] for name of obj2
  obj3



# library

class Lockstep

  #
  constructor: ->
    options = @_checkArguments(arguments)
    @settings = @_buildSettings(options)
    @running = false
    @count =
      start: 0
      stop: 0
      reset: 0
    @time =
      start: null # latest timestamp when the timer was started
      stop: null # latest timestamp when the timer was stopped
      elapsed: 0 # total milliseconds that timer has run (not including time since last animation frame)

  #
  _checkArguments: (args) ->
    # check basic arguments
    if args.length is 0 # no arguments
      throw new Error('No arguments supplied.')
    else if args.length is 1
      if type(args[0]) is 'function' # 'step' callback only
        options = { step: args[0] }
      else if type(args[0]) is 'object' # options object only
        if type(args[0].step) is 'function' # options object contains 'step' function
          options = args[0]
        else # no 'step' function
          throw new Error('Bad arguments supplied (no valid "step" function).')
      else # bad arguments
        throw new Error('Bad arguments supplied (wrong type).')
    else if args.length >= 2
      if type(args[0]) is 'object' and type(args[1]) is 'function' # options object & 'step' callback
        if args[0].step?
          throw new Error('Bad arguments supplied (redundant "step" function).')
        else
          args[0].step = args[1]
          options = args[0]
      else # bad arguments
        throw new Error('Bad arguments supplied (wrong type).')
    # check remaining options
    if options.pad?
      if not (options.pad is false or isInt(options.pad)) # "pad" option
        throw new Error('Bad arguments supplied ("pad" option must have a false or integer value).')
    options

  #
  _buildSettings: (options) ->
    defaults =
      # elapsed: +new Date # integer; milliseconds at which to start elapsed time
      pad: false # integer (or false); pads clock time to a number of places
      floor: false # boolean; removes decimal (via Math.floor) from elapsed time
    merge(defaults, options)

  #
  _millisecondsToClockTime: (ms) ->
    milliseconds: ms % 1000
    seconds: Math.floor(ms / MSQTY.seconds) % 60
    minutes: Math.floor(ms / MSQTY.minutes) % 60
    hours: Math.floor(ms / MSQTY.hours) % 24
    days: Math.floor(ms / MSQTY.days)

  #
  _millisecondsToElapsedTime: (ms) ->
    milliseconds: ms
    seconds: ms / MSQTY.seconds
    minutes: ms / MSQTY.minutes
    hours: ms / MSQTY.hours
    days: ms / MSQTY.days

  #
  _elapsedTimeToMilliseconds: (elapsedTime) ->
    elapsedTime.milliseconds

  #
  _clockTimeToMilliseconds: (clockTime) ->
    ms = 0
    ms += val * MSQTY[key] for key, val of clockTime
    ms

  #
  _loop: =>
    @pulse = window.requestAnimationFrame(@_loop) # request next frame
    @_step()

  #
  _step: ->
    @settings.step(@getInfo())

  #
  _pad: (int, length) ->
    int += '' # cast to string
    if int.length >= length # if the string is already long enough
      int
    else
      "#{new Array(length - int.length + 1).join('0')}int"

  #
  start: (callback = @settings.start) ->
    if not @running
      @time.start = new Date().getTime() # set start timestamp
      @count.start++
      @running = true
      @_loop()
      callback?(@getInfo()) # TODO: ensure that info is time-accurate
    this

  #
  stop: (callback = @settings.stop) ->
    if @running
      window.cancelAnimationFrame(@pulse)
      @time.stop = new Date().getTime() # set stop timestamp
      @time.elapsed += @time.stop - @time.start # add elapsed time
      @count.stop++
      @running = false
      @_step() # final step
      callback?(@getInfo()) # TODO: ensure that info is time-accurate
    this

  #
  reset: (callback = @settings.reset, count) ->
    if @time.elapsed > 0 # if there's elapsed time to reset
      @count.reset++
      @time.start = new Date().getTime() # set start timestamp
      @time.stop = null
      @time.elapsed = 0
      if count and val > 0 for key, val of @time # if there are counts to reset
        @count.start = 0
        @count.stop = 0
        @count.reset = 0
      callback?(@getInfo()) # TODO: ensure that info is time-accurate
    this

  #
  add: (milliseconds) ->
    this

  #
  subtract: (milliseconds) ->
    this

  #
  getInfo: ->
    milliseconds = if @running # timer is currently running
        @time.elapsed + new Date().getTime() - @time.start
      else # timer is stopped, or has never run
        @time.elapsed
    elapsed = @_millisecondsToElapsedTime(milliseconds)
    clock = @_millisecondsToClockTime(milliseconds)
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
  setElapsedTime: (elapsedTime) ->
    this

  # call callback at a specific time
  when: (time, callback) ->
    this

  # call callback at a specified time interval
  # TODO: use @when()
  every: (time, callback) ->
    this

  # call callback on each step through a specified time period
  # TODO: use @when()
  while: (startTime, endTime, callback) ->
    this

  # call callback at the beginning of a specified time period, and another callback at the end
  # TODO: use @when()
  during: (startTime, endTime, startCallback, endCallback) ->
    this

  #
  # TODO: use @during() with an infinity endTime
  beginning: (startTime, startCallback) ->
    @during(startTime, Infinity, startCallback, noop)
    this

  #
  # TODO: use @during() with a zero startTime
  ending: (endTime, endCallback) ->
    this



# expose
#   see: http://oli.me.uk/2013/07/21/exporting-through-amd-commonjs-and-the-global-object/

if typeof define is 'function' and define.amd? # AMD
  define -> Lockstep
else if module?.exports? # CommonJS
  module.exports = Lockstep
else
  @Lockstep = Lockstep # global
