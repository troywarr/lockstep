(function() {
  var Lockstep, MSQTY, merge, type,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  MSQTY = {};

  MSQTY.milliseconds = 1;

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
      var options;
      options = this._checkArguments(arguments);
      this.settings = this._buildSettings(options);
      this.running = false;
      this.count = {
        start: 0,
        stop: 0,
        reset: 0
      };
      this.time = {
        start: null,
        stop: null,
        elapsed: 0
      };
    }

    Lockstep.prototype._checkArguments = function(args) {
      if (args.length === 0) {
        throw new Error('No arguments supplied.');
      } else if (args.length === 1) {
        if (type(args[0]) === 'function') {
          return {
            step: args[0]
          };
        } else if (type(args[0]) === 'object') {
          if (type(args[0].step) === 'function') {
            return args[0];
          } else {
            throw new Error('Bad arguments supplied (no valid "step" function).');
          }
        } else {
          throw new Error('Bad arguments supplied (wrong type).');
        }
      } else if (args.length >= 2) {
        if (type(args[0]) === 'object' && type(args[1]) === 'function') {
          if (args[0].step != null) {
            throw new Error('Bad arguments supplied (redundant "step" function).');
          } else {
            args[0].step = args[1];
            return args[0];
          }
        } else {
          throw new Error('Bad arguments supplied (wrong type).');
        }
      }
    };

    Lockstep.prototype._buildSettings = function(options) {
      var defaults;
      defaults = {
        pad: false,
        floor: false
      };
      return merge(defaults, options);
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
        seconds: ms / MSQTY.seconds,
        minutes: ms / MSQTY.minutes,
        hours: ms / MSQTY.hours,
        days: ms / MSQTY.days
      };
    };

    Lockstep.prototype._elapsedTimeToMilliseconds = function(elapsedTime) {
      return elapsedTime.milliseconds;
    };

    Lockstep.prototype._clockTimeToMilliseconds = function(clockTime) {
      var key, ms, val;
      ms = 0;
      for (key in clockTime) {
        val = clockTime[key];
        ms += val * MSQTY[key];
      }
      return ms;
    };

    Lockstep.prototype._loop = function() {
      this.pulse = window.requestAnimationFrame(this._loop);
      return this._step();
    };

    Lockstep.prototype._step = function() {
      return this.settings.step(this.getInfo());
    };

    Lockstep.prototype.start = function(callback) {
      if (callback == null) {
        callback = this.settings.start;
      }
      if (!this.running) {
        this.time.start = new Date().getTime();
        this.count.start++;
        this.running = true;
        this._loop();
      }
      if (typeof callback === "function") {
        callback(this.getInfo());
      }
      return this;
    };

    Lockstep.prototype.stop = function(callback) {
      if (callback == null) {
        callback = this.settings.stop;
      }
      if (this.running) {
        window.cancelAnimationFrame(this.pulse);
        this.time.stop = new Date().getTime();
        this.time.elapsed += this.time.stop - this.time.start;
        this.count.stop++;
        this.running = false;
        this._step();
      }
      if (typeof callback === "function") {
        callback(this.getInfo());
      }
      return this;
    };

    Lockstep.prototype.reset = function(callback, count) {
      if (callback == null) {
        callback = this.settings.reset;
      }
      this.count.reset++;
      this.time.start = new Date().getTime();
      this.time.stop = null;
      this.time.elapsed = 0;
      if (count) {
        this.count.start = 0;
        this.count.stop = 0;
        this.count.reset = 0;
      }
      if (typeof callback === "function") {
        callback(this.getInfo());
      }
      return this;
    };

    Lockstep.prototype.add = function(milliseconds) {
      return this;
    };

    Lockstep.prototype.subtract = function(milliseconds) {
      return this;
    };

    Lockstep.prototype.getInfo = function() {
      var milliseconds;
      milliseconds = this.running ? this.time.elapsed + new Date().getTime() - this.time.start : this.time.elapsed;
      return {
        time: {
          elapsed: this._millisecondsToElapsedTime(milliseconds),
          clock: this._millisecondsToClockTime(milliseconds)
        },
        count: this.count
      };
    };

    Lockstep.prototype.setElapsedTime = function(elapsedTime) {
      return this;
    };

    Lockstep.prototype.when = function(time, callback) {
      return this;
    };

    Lockstep.prototype.every = function(time, callback) {
      return this;
    };

    Lockstep.prototype["while"] = function(startTime, endTime, callback) {
      return this;
    };

    Lockstep.prototype.during = function(startTime, endTime, startCallback, endCallback) {
      return this;
    };

    Lockstep.prototype.beginning = function(startTime, startCallback) {
      this.during(startTime, Infinity, startCallback, noop);
      return this;
    };

    Lockstep.prototype.ending = function(endTime, endCallback) {
      return this;
    };

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
