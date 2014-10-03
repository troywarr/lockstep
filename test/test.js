var should = require('should');
var chai = require('chai');

var Lockstep = require('../dist/lockstep');

expect = chai.expect;



describe('Lockstep', function() {

  // constructor
  describe('constructor', function() {
    it('should throw if no arguments are supplied', function() {
      expect(function() {
        new Lockstep();
      }).to.throw('No arguments supplied.');
    });

    it('should initialize with timer not running', function() {
      var lockstep = new Lockstep({});
      expect(lockstep.running).to.equal(false);
    });
  });

  // .start()
  describe('#start()', function() {
    it('should increment start counter', function() {
      var lockstep = new Lockstep({});
      lockstep.start();
      expect(lockstep.count.start).to.equal(1); // TODO: access info.start via .getInfo()?
    });

    it('should set timer to running', function() {
      var lockstep = new Lockstep({});
      lockstep.start();
      expect(lockstep.running).to.equal(true); // TODO: access info.start via .getInfo()?
    });
  });

});
