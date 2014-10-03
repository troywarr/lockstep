(function() {
  var Lockstep, MSQTY, merge, type,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  MSQTY = {};

  MSQTY.seconds = 1000;

  MSQTY.minutes = MSQTY.seconds * 60;

  MSQTY.hours = MSQTY.minutes * 60;

  MSQTY.days = MSQTY.hours * 24;

  type = function(variable) {
    return {}.toString.call(variable).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  };

  merge = function(obj1, obj2) {
    var name, obj3;
    obj3 = {};
    for (name in obj1) {
      obj3[name] = obj1[name];
    }
    for (name in obj2) {
      obj3[name] = obj2[name];
    }
    return obj3;
  };

  Lockstep = (function() {
    function Lockstep() {
      this._loop = __bind(this._loop, this);
      this._checkArguments(arguments);
      this.settings = this._buildSettings();
      this.running = false;
      this.count = {
        start: 0,
        stop: 0,
        reset: 0
      };
    }

    Lockstep.prototype._checkArguments = function(args) {
      switch (args.length) {
        case 1:
          if (type(args[0]) === 'function') {
            this.options = {};
            return this.callback = args[0];
          } else if (type(args[0]) === 'object') {
            this.options = args[0];
            return this.callback = args[0].step;
          } else {
            throw new Error('Bad arguments supplied.');
          }
          break;
        case 2:
          if (type(args[0]) === 'object' && type(args[1]) === 'function') {
            this.options = args[0];
            return this.callback = args[1];
          } else {
            throw new Error('Bad arguments supplied.');
          }
          break;
        default:
          throw new Error('No arguments supplied.');
      }
    };

    Lockstep.prototype._buildSettings = function() {
      var defaults;
      defaults = {
        elapsed: +(new Date),
        interval: 1000
      };
      return merge(defaults, this.options);
    };

    Lockstep.prototype._millisecondsToClockTime = function(ms) {
      return {
        milliseconds: ms % 1000,
        seconds: Math.floor(ms / MSQTY.seconds) % 60,
        minutes: Math.floor(ms / MSQTY.minutes) % 60,
        hours: Math.floor(ms / MSQTY.hours) % 24,
        days: Math.floor(ms / MSQTY.days)
      };
    };

    Lockstep.prototype._millisecondsToElapsedTime = function(ms) {
      return {
        milliseconds: ms,
        seconds: Math.floor(ms / MSQTY.seconds),
        minutes: Math.floor(ms / MSQTY.minutes),
        hours: Math.floor(ms / MSQTY.hours),
        days: Math.floor(ms / MSQTY.days)
      };
    };

    Lockstep.prototype._elapsedTimeToMilliseconds = function(elapsedTime) {
      return elapsedTime.milliseconds;
    };

    Lockstep.prototype._clockTimeToMilliseconds = function(clockTime) {
      var key, ms, val;
      ms = 0;
      for (key in obj) {
        val = obj[key];
        ms += val * MSQTY[key];
      }
      return ms;
    };

    Lockstep.prototype._loop = function() {
      this.pulse = window.requestAnimationFrame(this._loop);
      return this._step();
    };

    Lockstep.prototype._step = function() {
      var info;
      info = this.getInfo();
      return this.callback(info);
    };

    Lockstep.prototype.start = function() {
      if (!this.running) {
        this.count.start++;
        return this.running = true;
      }
    };

    Lockstep.prototype.stop = function() {
      if (this.running) {
        window.cancelAnimationFrame(this.pulse);
        this.count.stop++;
        this.running = false;
        return this._step();
      }
    };

    Lockstep.prototype.reset = function(andStop) {
      this.count.reset++;
      if (andStop) {
        this.stop();
      }
      return this._step();
    };

    Lockstep.prototype.add = function(milliseconds) {};

    Lockstep.prototype.subtract = function(milliseconds) {};

    Lockstep.prototype.getInfo = function() {
      var milliseconds;
      milliseconds = this.getMilliseconds();
      return {
        time: {
          elapsed: this._millisecondsToElapsedTime(milliseconds),
          clock: this._millisecondsToClockTime(milliseconds)
        },
        count: this.count
      };
    };

    Lockstep.prototype.getMilliseconds = function() {
      return +(new Date) - this.settings.elapsed;
    };

    Lockstep.prototype.getElapsedTime = function() {};

    Lockstep.prototype.setElapsedTime = function(elapsedTime) {};

    Lockstep.prototype.when = function(time, callback) {};

    Lockstep.prototype.every = function(time, callback) {};

    Lockstep.prototype["while"] = function(startTime, endTime, callback) {};

    Lockstep.prototype.during = function(startTime, endTime, startCallback, endCallback) {};

    Lockstep.prototype.beginning = function() {};

    Lockstep.prototype.ending = function() {};

    return Lockstep;

  })();

  if (typeof define === 'function' && (define.amd != null)) {
    define(function() {
      return Lockstep;
    });
  } else if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = Lockstep;
  } else {
    this.Lockstep = Lockstep;
  }

}).call(this);
