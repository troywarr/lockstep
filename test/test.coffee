should = require('should')
chai = require('chai')
Lockstep = require('../dist/lockstep')

expect = chai.expect

noop = ->



describe 'Lockstep', ->

  # constructor
  describe 'constructor', ->

    it 'should initialize with timer not running', ->
      lockstep = new Lockstep(noop)
      expect(lockstep.running).to.equal(false)

  # _checkArguments()
  describe '#_checkArguments()', ->

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

  # _buildSettings()
  describe '#_buildSettings()', ->

    it 'should increment start counter', ->
      lockstep = new Lockstep(noop)
      lockstep.start()
      expect(lockstep.count.start).to.equal(1)

  # .start()
  describe '#start()', ->

    it 'should increment start counter', ->
      lockstep = new Lockstep(noop)
      lockstep.start()
      expect(lockstep.count.start).to.equal(1)

    it 'should set timer to running', ->
      lockstep = new Lockstep(noop)
      lockstep.start()
      expect(lockstep.running).to.equal(true)

  # .stop()
  describe '#stop()', ->

    it 'should increment stop counter', ->
      lockstep = new Lockstep(noop)
      lockstep.start().stop()
      expect(lockstep.count.stop).to.equal(1)

    it 'should set timer to not running', ->
      lockstep = new Lockstep(noop)
      lockstep.start().stop()
      expect(lockstep.running).to.equal(false)

  # .reset()
  describe '#reset()', ->

    it 'should increment reset counter', ->
      lockstep = new Lockstep(noop)
      lockstep.start().reset()
      expect(lockstep.count.reset).to.equal(1)

    it 'should still be running if no arguments are passed', ->
      lockstep = new Lockstep(noop)
      lockstep.start().reset()
      expect(lockstep.running).to.equal(true)

    it 'should not increment stop counter if no arguments are passed', ->
      lockstep = new Lockstep(noop)
      lockstep.start().reset()
      expect(lockstep.count.stop).to.equal(0)

    it 'should stop running if true is passed', ->
      lockstep = new Lockstep(noop)
      lockstep.start().reset(true)
      expect(lockstep.running).to.equal(false)

    it 'should increment stop counter if true is passed', ->
      lockstep = new Lockstep(noop)
      lockstep.start().reset(true)
      expect(lockstep.count.stop).to.equal(1)

  # .getInfo()
  describe '#getInfo()', ->

    it 'should return an object', ->
      lockstep = new Lockstep(noop)
      expect(lockstep.getInfo()).to.be.an.Object;

    it 'should initially return specific properties and values', ->
      lockstep = new Lockstep(noop)
      expect(lockstep.getInfo()).to.eql
        time:
          elapsed:
            milliseconds: 0
            seconds: 0
            minutes: 0
            hours: 0
            days: 0
          clock:
            milliseconds: 0
            seconds: 0
            minutes: 0
            hours: 0
            days: 0
        count:
          start: 0
          stop: 0
          reset: 0
