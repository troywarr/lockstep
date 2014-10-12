(function() {
  var Lockstep, MSQTY, isInt, merge, microseconds, noop, type, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  MSQTY = {};

  MSQTY.microseconds = 0.001;

  MSQTY.milliseconds = 1;

  MSQTY.seconds = 1000;

  MSQTY.minutes = MSQTY.seconds * 60;

  MSQTY.hours = MSQTY.minutes * 60;

  MSQTY.days = MSQTY.hours * 24;

  noop = function() {};

  type = function(value) {
    return {}.toString.call(value).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  };

  isInt = function(value) {
    return !isNaN(value) && parseInt(Number(value)) === value && !isNaN(parseInt(value, 10));
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

  microseconds = true;

  window.performance = (_ref = window.performance) != null ? _ref : {};

  performance.now = (function() {
    var _ref1, _ref2, _ref3, _ref4, _ref5;
    return (_ref1 = (_ref2 = (_ref3 = (_ref4 = (_ref5 = performance.now) != null ? _ref5 : performance.mozNow) != null ? _ref4 : performance.msNow) != null ? _ref3 : performance.oNow) != null ? _ref2 : performance.webkitNow) != null ? _ref1 : microseconds = false || function() {
      var _ref6;
      return (_ref6 = typeof Date.now === "function" ? Date.now() : void 0) != null ? _ref6 : new Date().getTime();
    };
  })();

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
      var options;
      if (args.length === 0) {
        throw new Error('No arguments supplied.');
      } else if (args.length === 1) {
        if (type(args[0]) === 'function') {
          options = {
            step: args[0]
          };
        } else if (type(args[0]) === 'object') {
          if (type(args[0].step) === 'function') {
            options = args[0];
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
            options = args[0];
          }
        } else {
          throw new Error('Bad arguments supplied (wrong type).');
        }
      }
      if (options.pad != null) {
        if (!(options.pad === false || isInt(options.pad))) {
          throw new Error('Bad arguments supplied ("pad" option must have a false or integer value).');
        }
      }
      return options;
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
      var clockTime, clockTimeMicroseconds;
      if (microseconds) {
        clockTimeMicroseconds = {
          microseconds: Math.floor((ms % 1) / MSQTY.microseconds)
        };
        ms = Math.floor(ms);
      }
      clockTime = {
        milliseconds: ms % 1000,
        seconds: Math.floor(ms / MSQTY.seconds) % 60,
        minutes: Math.floor(ms / MSQTY.minutes) % 60,
        hours: Math.floor(ms / MSQTY.hours) % 24,
        days: Math.floor(ms / MSQTY.days)
      };
      return merge(clockTime, clockTimeMicroseconds != null ? clockTimeMicroseconds : {});
    };

    Lockstep.prototype._millisecondsToElapsedTime = function(ms) {
      var clockTime, clockTimeMicroseconds;
      if (microseconds) {
        clockTimeMicroseconds = {
          microseconds: ms / MSQTY.microseconds
        };
      }
      clockTime = {
        milliseconds: ms,
        seconds: ms / MSQTY.seconds,
        minutes: ms / MSQTY.minutes,
        hours: ms / MSQTY.hours,
        days: ms / MSQTY.days
      };
      return merge(clockTime, clockTimeMicroseconds != null ? clockTimeMicroseconds : {});
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

    Lockstep.prototype._pad = function(int, length) {
      int += '';
      if (int.length >= length) {
        return int;
      } else {
        return "" + (new Array(length - int.length + 1).join('0')) + "int";
      }
    };

    Lockstep.prototype.start = function(callback) {
      if (callback == null) {
        callback = this.settings.start;
      }
      if (!this.running) {
        this.time.start = performance.now();
        this.count.start++;
        this.running = true;
        this._loop();
        if (typeof callback === "function") {
          callback(this.getInfo());
        }
      }
      return this;
    };

    Lockstep.prototype.stop = function(callback) {
      if (callback == null) {
        callback = this.settings.stop;
      }
      if (this.running) {
        window.cancelAnimationFrame(this.pulse);
        this.time.stop = performance.now();
        this.time.elapsed += this.time.stop - this.time.start;
        this.count.stop++;
        this.running = false;
        this._step();
        if (typeof callback === "function") {
          callback(this.getInfo());
        }
      }
      return this;
    };

    Lockstep.prototype.reset = function(callback, count) {
      var key, val;
      if (callback == null) {
        callback = this.settings.reset;
      }
      if (this.time.elapsed > 0) {
        this.count.reset++;
        this.time.start = performance.now();
        this.time.stop = null;
        this.time.elapsed = 0;
        if ((function() {
          var _ref1, _results;
          _ref1 = this.time;
          _results = [];
          for (key in _ref1) {
            val = _ref1[key];
            _results.push(count && val > 0);
          }
          return _results;
        }).call(this)) {
          this.count.start = 0;
          this.count.stop = 0;
          this.count.reset = 0;
        }
        if (typeof callback === "function") {
          callback(this.getInfo());
        }
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
      var clock, elapsed, key, milliseconds, val;
      milliseconds = this.running ? this.time.elapsed + performance.now() - this.time.start : this.time.elapsed;
      elapsed = this._millisecondsToElapsedTime(milliseconds);
      clock = this._millisecondsToClockTime(milliseconds);
      if (this.settings.floor) {
        for (key in elapsed) {
          val = elapsed[key];
          elapsed = Math.floor(val);
        }
      }
      if (this.settings.pad) {
        for (key in clock) {
          val = clock[key];
          val = this._pad(val, this.settings.pad);
        }
      }
      return {
        time: {
          elapsed: elapsed,
          clock: clock
        },
        count: this.count
      };
    };

    Lockstep.prototype.setInfo = function(info) {
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
