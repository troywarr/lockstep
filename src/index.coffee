# constants

MSQTY = {}
MSQTY.seconds = 1000
MSQTY.minutes = MSQTY.seconds * 60
MSQTY.hours = MSQTY.minutes * 60
MSQTY.days = MSQTY.hours * 24



# utilities

# determine variable type
#   see: http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
type = (variable) ->
  ({}).toString.call(variable).match(/\s([a-zA-Z]+)/)[1].toLowerCase()

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
    @_checkArguments(arguments)
    @settings = @_buildSettings()
    @running = false
    @count =
      start: 0
      stop: 0
      reset: 0

  #
  _checkArguments: (args) ->
    switch args.length
      when 1
        if type(args[0]) is 'function' # 'tick' callback only
          @options = {}
          @callback = args[0]
        else if type(args[0]) is 'object' # options object only
          @options = args[0]
          @callback = args[0].tick
        else # bad arguments
          throw new Error('Bad arguments supplied.')
      when 2
        if type(args[0]) is 'object' and type(args[1]) is 'function' # options object & 'tick' callback
          @options = args[0]
          @callback = args[1]
        else # bad arguments
          throw new Error('Bad arguments supplied.')
      else # no arguments
        throw new Error('No arguments supplied.')

  #
  _buildSettings: ->
    defaults =
      elapsed: +new Date
      interval: 1000
    merge(defaults, @options)

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
    seconds: Math.floor(ms / MSQTY.seconds)
    minutes: Math.floor(ms / MSQTY.minutes)
    hours: Math.floor(ms / MSQTY.hours)
    days: Math.floor(ms / MSQTY.days)

  #
  _elapsedTimeToMilliseconds: (elapsedTime) ->
    elapsedTime.milliseconds

  #
  _clockTimeToMilliseconds: (clockTime) ->
    ms = 0
    ms += val * MSQTY[key] for key, val of obj
    ms

  #
  _loop: =>
    @pulse = window.requestAnimationFrame(@_loop) # request next frame
    @_tick()

  #
  _tick: ->
    info = @getInfo()
    @callback(info)

  #
  start: ->
    if not @running
      @_loop()
      @count.start++
      @running = true

  #
  stop: ->
    if @running
      window.cancelAnimationFrame(@pulse)
      @count.stop++
      @running = false
      @_tick()

  #
  reset: (andStop) ->
    @count.reset++
    if andStop then @stop()
    @_tick()

  #
  add: (milliseconds) ->

  #
  subtract: (milliseconds) ->

  #
  getInfo: ->
    milliseconds = @getMilliseconds()
    {
      time:
        elapsed: @_millisecondsToElapsedTime(milliseconds)
        clock: @_millisecondsToClockTime(milliseconds)
      count: @count
    }

  #
  getMilliseconds: ->
    +new Date - @settings.elapsed # elapsed time in milliseconds

  #
  getElapsedTime: ->

  #
  setElapsedTime: (elapsedTime) ->

  # call callback at a specific time
  when: (time, callback) ->

  # call callback at a specified time interval
  # TODO: use @when()
  every: (time, callback) ->

  # call callback on each tick through a specified time period
  # TODO: use @when()
  while: (startTime, endTime, callback) ->

  # call callback at the beginning of a specified time period, and another callback at the end
  # TODO: use @when()
  during: (startTime, endTime, startCallback, endCallback) ->

  #
  # TODO: use @during() with an infinity endTime
  beginning: ->

  #
  # TODO: use @during() with a zero startTime
  ending: ->



# register

window.Lockstep = Lockstep
