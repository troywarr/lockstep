# shortcuts

expect = chai.expect
spy = sinon.spy()
stub = sinon.stub()



# shared test values

noop = ->

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



  describe '#_checkArguments()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_checkArguments')

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
      expect(lockstep._runTimeToClockTime(123456789)).to.be.an('object')

    it 'should return specific properties and values', ->
      lockstep = new Lockstep(noop)
      expect(lockstep._runTimeToClockTime(123456789)).to.deep.equal(clockTime)



  describe '#_runTimeToElapsedTime()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_runTimeToElapsedTime')

    it 'should return an object', ->
      lockstep = new Lockstep(noop)
      expect(lockstep._runTimeToElapsedTime(123456789)).to.be.an('object')

    it 'should return specific properties and values', ->
      lockstep = new Lockstep(noop)
      expect(lockstep._runTimeToElapsedTime(123456789)).to.deep.equal(elapsedTime)



  # describe '#_elapsedTimeToMilliseconds()', ->
  #
  #   it 'should be callable', ->
  #     expect(Lockstep).to.respondTo('_elapsedTimeToMilliseconds')
  #
  #   it 'should return a number', ->
  #     lockstep = new Lockstep(noop)
  #     expect(lockstep._elapsedTimeToMilliseconds(elapsedTime)).to.be.a('number')
  #
  #   it 'should return a specific value', ->
  #     lockstep = new Lockstep(noop)
  #     expect(lockstep._elapsedTimeToMilliseconds(elapsedTime)).to.equal(123456789)
  #
  #
  #
  # describe '#_clockTimeToMilliseconds()', ->
  #
  #   it 'should be callable', ->
  #     expect(Lockstep).to.respondTo('_clockTimeToMilliseconds')
  #
  #   it 'should return a number', ->
  #     lockstep = new Lockstep(noop)
  #     expect(lockstep._clockTimeToMilliseconds(clockTime)).to.be.a('number')
  #
  #   it 'should return a specific value', ->
  #     lockstep = new Lockstep(noop)
  #     expect(lockstep._clockTimeToMilliseconds(clockTime)).to.equal(123456789)



  describe '#_getInfo()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_getInfo')

    it 'should return an object', ->
      lockstep = new Lockstep(noop)
      expect(lockstep._getInfo()).to.be.an('object')

    it 'should initially return specific properties and values', ->
      lockstep = new Lockstep(noop)
      expect(lockstep._getInfo()).to.deep.equal
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



  describe '#_setInfo()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_setInfo')

    it 'should return the context object for chainability', ->
      lockstep = new Lockstep(noop)
      expect(lockstep._setInfo()).to.equal(lockstep)



  describe '#_loop()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_loop')



  describe '#_step()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('_step')



  describe '#info()', ->

    it 'should be callable', ->
      expect(Lockstep).to.respondTo('info')

    it 'should not throw if no arguments are supplied', ->
      expect(->
        lockstep = new Lockstep(noop)
        lockstep.info()
      ).to.not.throw()

    it 'should throw if the single argument supplied is not an object', ->
      expect(->
        lockstep = new Lockstep(noop)
        lockstep.info('foo')
      ).to.throw('Bad arguments supplied (wrong type).')

    # with no arguments, should call ._getInfo()

    # with one argument (an object), should call ._setInfo()



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



  # describe '#add()', ->
  #
  #   it 'should be callable', ->
  #     expect(Lockstep).to.respondTo('add')
  #
  #   it 'should return the context object for chainability', ->
  #     lockstep = new Lockstep(noop)
  #     expect(lockstep.add()).to.equal(lockstep)
  #
  #   # should add the appropriate time
  #
  #
  #
  # describe '#subtract()', ->
  #
  #   it 'should be callable', ->
  #     expect(Lockstep).to.respondTo('subtract')
  #
  #   it 'should return the context object for chainability', ->
  #     lockstep = new Lockstep(noop)
  #     expect(lockstep.subtract()).to.equal(lockstep)
  #
  #   # should subtract the appropriate time
  #
  #
  #
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
