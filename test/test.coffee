should = require('should')
chai = require('chai')

Lockstep = require('../dist/lockstep')

expect = chai.expect



describe 'Lockstep', ->

  # constructor
  describe 'constructor', ->
    it 'should throw if no arguments are supplied', ->
      expect ->
        new Lockstep
      .to.throw('No arguments supplied.')

    it 'should initialize with timer not running', ->
      lockstep = new Lockstep({})
      expect(lockstep.running).to.equal(false)

  # .start()
  describe '#start()', ->
    it 'should increment start counter', ->
      lockstep = new Lockstep({})
      lockstep.start()
      expect(lockstep.count.start).to.equal(1) # TODO: access info.start via .getInfo()?

    it 'should set timer to running', ->
      lockstep = new Lockstep({})
      lockstep.start()
      expect(lockstep.running).to.equal(true) # TODO: access info.start via .getInfo()?
