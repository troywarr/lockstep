# shortcuts

expect = chai.expect
spy = sinon.spy()
stub = sinon.stub()



# shared test values

noop = ->

exampleTime = 123456789

initialInfo =
  time:
    elapsed:
      microseconds: 0
      milliseconds: 0
      seconds: 0
      minutes: 0
      hours: 0
      days: 0
    clock:
      microseconds: 0
      milliseconds: 0
      seconds: 0
      minutes: 0
      hours: 0
      days: 0
  count:
    start: 0
    stop: 0
    reset: 0

elapsedTime =
  microseconds: 123456789000
  milliseconds: 123456789
  seconds: 123456.789
  minutes: 2057.61315
  hours: 34.2935525
  days: 1.4288980208333333

clockTime =
  microseconds: 0
  milliseconds: 789
  seconds: 36
  minutes: 17
  hours: 10
  days: 1



# tests

describe 'Lockstep', ->



  describe 'constructor', ->

    it 'should initialize with timer not running', ->
      lockstep = new Lockstep(noop)
      expect(lockstep.running).to.equal(false)



  describe '#_type()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_type')



  describe '#_isInt()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_isInt')



  describe '#_merge()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_merge')



  describe '#_pad()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_pad')



  describe '#_hasHighResolutionTime()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_hasHighResolutionTime')



  describe '#_validateOptions()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_validateOptions')

    it 'should throw if no arguments are supplied', ->
      expect(->
        new Lockstep
      ).to.throw('No arguments supplied.')

    it 'should throw if the single argument supplied is not a function or object', ->
      expect(->
        new Lockstep('foo')
      ).to.throw('Bad arguments supplied (wrong type).')

    it 'should throw if the single argument supplied is an object not containing a "step" function', ->
      expect(->
        new Lockstep({})
      ).to.throw('Bad arguments supplied (no valid "step" function).')

    it 'should throw if the two arguments supplied are not a function and an object', ->
      expect(->
        new Lockstep('foo', 'bar')
      ).to.throw('Bad arguments supplied (wrong type).')

    it 'should throw if the two arguments supplied both identify a "step" function', ->
      expect(->
        new Lockstep({
          step: noop
        }, noop)
      ).to.throw('Bad arguments supplied (redundant "step" function).')

    it 'should not throw if the single argument supplied is a function', ->
      expect(->
        new Lockstep(noop)
      ).to.not.throw()

    it 'should not throw if the single argument supplied is an object containing a "step" function', ->
      expect(->
        new Lockstep({
          step: noop
        })
      ).to.not.throw()

    it 'should not throw if the two arguments supplied are an object not containing a "step" function and a "step" function', ->
      expect(->
        new Lockstep({}, noop)
      ).to.not.throw()

    it 'should not throw if two good arguments are supplied, plus a useless additional argument', ->
      expect(->
        new Lockstep({}, noop, 'foo')
      ).to.not.throw()



  describe '#_buildSettings()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_buildSettings')

    it 'should return an object', ->
      lockstep = new Lockstep(noop)
      expect(lockstep._buildSettings({})).to.be.an('object')



  describe '#_runTimeToClockTime()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_runTimeToClockTime')

    it 'should return an object', ->
      lockstep = new Lockstep(noop)
      expect(lockstep._runTimeToClockTime(exampleTime)).to.be.an('object')

    it 'should return specific properties and values', ->
      lockstep = new Lockstep(noop)
      expect(lockstep._runTimeToClockTime(exampleTime)).to.deep.equal(clockTime)



  describe '#_runTimeToElapsedTime()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_runTimeToElapsedTime')

    it 'should return an object', ->
      lockstep = new Lockstep(noop)
      expect(lockstep._runTimeToElapsedTime(exampleTime)).to.be.an('object')

    it 'should return specific properties and values', ->
      lockstep = new Lockstep(noop)
      expect(lockstep._runTimeToElapsedTime(exampleTime)).to.deep.equal(elapsedTime)



  describe '#_elapsedTimeToRunTime()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_elapsedTimeToRunTime')

    it 'should return a number', ->
      lockstep = new Lockstep(noop)
      expect(lockstep._elapsedTimeToRunTime({ seconds: elapsedTime.seconds })).to.be.a('number')

    it 'should return a specific value', ->
      lockstep = new Lockstep(noop)
      expect(lockstep._elapsedTimeToRunTime({ seconds: elapsedTime.seconds })).to.equal(exampleTime)

    it 'should throw if a property is not recognized', ->
      lockstep = new Lockstep(noop)
      expect(->
        lockstep._elapsedTimeToRunTime
          femtoseconds: 1
      ).to.throw('Bad arguments supplied (wrong property).')

    it 'should throw if multiple properties are supplied', ->
      lockstep = new Lockstep(noop)
      expect(->
        lockstep._elapsedTimeToRunTime
          microseconds: 1
          milliseconds: 1
      ).to.throw('Bad arguments supplied (too many properties).')



  describe '#_clockTimeToRunTime()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_clockTimeToRunTime')

    it 'should return a number', ->
      lockstep = new Lockstep(noop)
      expect(lockstep._clockTimeToRunTime(clockTime)).to.be.a('number')

    it 'should return a specific value', ->
      lockstep = new Lockstep(noop)
      expect(lockstep._clockTimeToRunTime(clockTime)).to.equal(exampleTime)

    it 'should throw if a property is not recognized', ->
      lockstep = new Lockstep(noop)
      expect(->
        lockstep._clockTimeToRunTime
          femtoseconds: 1
      ).to.throw('Bad arguments supplied (wrong property).')



  describe '#_getInfo()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_getInfo')

    it 'should return an object', ->
      lockstep = new Lockstep(noop)
      expect(lockstep._getInfo()).to.be.an('object')

    it 'should initially return specific properties and values', ->
      lockstep = new Lockstep(noop)
      expect(lockstep._getInfo()).to.deep.equal(initialInfo)



  describe '#_adjustRunTime()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_adjustRunTime')



  describe '#_adjustCount()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_adjustCount')

    it 'should set count equivalent to the provided count', ->
      lockstep = new Lockstep(noop)
      lockstep._adjustCount 'set',
        start: 1
        stop: 1
        reset: 1
      expect(lockstep.count).to.deep.equal
        start: 1
        stop: 1
        reset: 1

    it 'should throw if a property value is not an integer', ->
      lockstep = new Lockstep(noop)
      expect(->
        lockstep._adjustCount 'set',
          start: 'foo'
      ).to.throw('Bad arguments supplied (count value is not an integer).')

    it 'should throw if a property is not recognized', ->
      lockstep = new Lockstep(noop)
      expect(->
        lockstep._adjustCount 'set',
          disable: 1
      ).to.throw('Bad arguments supplied (wrong property).')



  describe '#_adjustInfo()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_adjustInfo')

    it 'should set run time equivalent of the provided clock time', ->
      lockstep = new Lockstep(noop)
      lockstep._adjustInfo 'set',
        clock: clockTime
      expect(lockstep.time.run).to.equal(exampleTime)

    it 'should set run time equivalent of the provided elapsed time', ->
      lockstep = new Lockstep(noop)
      lockstep._adjustInfo 'set',
        elapsed:
            milliseconds: elapsedTime.milliseconds
      expect(lockstep.time.run).to.equal(exampleTime)

    it 'should add the run time equivalent of the provided clock time', ->
      lockstep = new Lockstep(noop)
      lockstep.time.run = exampleTime
      lockstep._adjustInfo 'add',
        clock: clockTime
      expect(lockstep.time.run).to.equal(exampleTime * 2)

    it 'should add the run time equivalent of the provided elapsed time', ->
      lockstep = new Lockstep(noop)
      lockstep.time.run = exampleTime
      lockstep._adjustInfo 'add',
        elapsed:
            milliseconds: elapsedTime.milliseconds
      expect(lockstep.time.run).to.equal(exampleTime * 2)

    it 'should subtract the run time equivalent of the provided clock time', ->
      lockstep = new Lockstep(noop)
      lockstep.time.run = exampleTime * 2
      lockstep._adjustInfo 'subtract',
        clock: clockTime
      expect(lockstep.time.run).to.equal(exampleTime)

    it 'should subtract the run time equivalent of the provided elapsed time', ->
      lockstep = new Lockstep(noop)
      lockstep.time.run = exampleTime * 2
      lockstep._adjustInfo 'subtract',
        elapsed:
            milliseconds: elapsedTime.milliseconds
      expect(lockstep.time.run).to.equal(exampleTime)

    it 'should not allow the run time to fall below 0', ->
      lockstep = new Lockstep(noop)
      lockstep.time.run = 1000
      lockstep._adjustInfo 'subtract',
        elapsed:
            milliseconds: elapsedTime.milliseconds
      expect(lockstep.time.run).to.equal(0)



  describe '#_loop()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_loop')



  describe '#_step()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_step')



  describe '#start()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('start')

    it 'should increment start counter', ->
      lockstep = new Lockstep(noop)
      lockstep.start()
      expect(lockstep.count.start).to.equal(1)

    it 'should set timer to running', ->
      lockstep = new Lockstep(noop)
      lockstep.start()
      expect(lockstep.running).to.equal(true)

    it 'should return the context object for chainability', ->
      lockstep = new Lockstep(noop)
      expect(lockstep.start()).to.equal(lockstep)



  describe '#stop()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('stop')

    it 'should increment stop counter', ->
      lockstep = new Lockstep(noop)
      lockstep.start().stop()
      expect(lockstep.count.stop).to.equal(1)

    it 'should set timer to not running', ->
      lockstep = new Lockstep(noop)
      lockstep.start().stop()
      expect(lockstep.running).to.equal(false)

    it 'should return the context object for chainability', ->
      lockstep = new Lockstep(noop)
      expect(lockstep.stop()).to.equal(lockstep)



  describe '#reset()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('reset')

    # it 'should increment reset counter', ->
    #   lockstep = new Lockstep(noop)
    #   lockstep.start().reset()
    #   expect(lockstep.count.reset).to.equal(1)

    it 'should still be running if no arguments are passed', ->
      lockstep = new Lockstep(noop)
      lockstep.start().reset()
      expect(lockstep.running).to.equal(true)

    it 'should not increment stop counter if no arguments are passed', ->
      lockstep = new Lockstep(noop)
      lockstep.start().reset()
      expect(lockstep.count.stop).to.equal(0)

    it 'should return the context object for chainability', ->
      lockstep = new Lockstep(noop)
      expect(lockstep.reset()).to.equal(lockstep)

    # should reset all counters if the second argument is truthy

    # should not reset any counters if the second argument is falsy

    # should run callback if elapsed time is greater than zero

    # should not run callback if elapsed time is zero

    # should run callback after resetting counters



  describe '#info()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('info')

    it 'should not throw if no arguments are supplied', ->
      lockstep = new Lockstep(noop)
      expect(->
        lockstep.info()
      ).to.not.throw()

    it 'should throw if the single argument supplied is not an object', ->
      lockstep = new Lockstep(noop)
      expect(->
        lockstep.info('foo')
      ).to.throw('Bad arguments supplied (wrong type).')

    it 'should throw if both elapsed and clock time are supplied', ->
      lockstep = new Lockstep(noop)
      expect(->
        lockstep.info
          elapsed:
            milliseconds: 1
          clock:
            milliseconds: 1
      ).to.throw('Bad arguments supplied (both elapsed and clock times).')

    it 'should return the context object for chainability, if an object is supplied (setter)', ->
      lockstep = new Lockstep(noop)
      expect(lockstep.info({})).to.equal(lockstep)

    # with no arguments, should call ._getInfo()

    # with one argument (an object with an "elapsed" property), should call ._setElapsedTime()

    # with one argument (an object with a "clock" property), should call ._setClockTime()

    # with one argument (an object with a "count" property), should call ._setCount()



  describe '#add()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('add')

    it 'should return the context object for chainability', ->
      lockstep = new Lockstep(noop)
      expect(lockstep.add({})).to.equal(lockstep)

    # should add the appropriate time



  describe '#subtract()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('subtract')

    it 'should return the context object for chainability', ->
      lockstep = new Lockstep(noop)
      expect(lockstep.subtract({})).to.equal(lockstep)

    # should subtract the appropriate time



  # describe '#when()', ->
  #
  #   it 'should be callable', ->
  #     expect(Lockstep).to.respondTo('when')
  #
  #   it 'should return the context object for chainability', ->
  #     lockstep = new Lockstep(noop)
  #     expect(lockstep.when()).to.equal(lockstep)
  #
  #
  #
  # describe '#every()', ->
  #
  #   it 'should be callable', ->
  #     expect(Lockstep).to.respondTo('every')
  #
  #   it 'should return the context object for chainability', ->
  #     lockstep = new Lockstep(noop)
  #     expect(lockstep.every()).to.equal(lockstep)
  #
  #
  #
  # describe '#while()', ->
  #
  #   it 'should be callable', ->
  #     expect(Lockstep).to.respondTo('while')
  #
  #   it 'should return the context object for chainability', ->
  #     lockstep = new Lockstep(noop)
  #     expect(lockstep.while()).to.equal(lockstep)
  #
  #
  #
  # describe '#during()', ->
  #
  #   it 'should be callable', ->
  #     expect(Lockstep).to.respondTo('during')
  #
  #   it 'should return the context object for chainability', ->
  #     lockstep = new Lockstep(noop)
  #     expect(lockstep.during()).to.equal(lockstep)
  #
  #
  #
  # describe '#beginning()', ->
  #
  #   it 'should be callable', ->
  #     expect(Lockstep).to.respondTo('beginning')
  #
  #   it 'should return the context object for chainability', ->
  #     lockstep = new Lockstep(noop)
  #     expect(lockstep.beginning()).to.equal(lockstep)
  #
  #
  #
  # describe '#ending()', ->
  #
  #   it 'should be callable', ->
  #     expect(Lockstep).to.respondTo('ending')
  #
  #   it 'should return the context object for chainability', ->
  #     lockstep = new Lockstep(noop)
  #     expect(lockstep.ending()).to.equal(lockstep)
