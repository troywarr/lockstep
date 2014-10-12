!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Lockstep=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],2:[function(_dereq_,module,exports){
(function (process){
// Generated by CoffeeScript 1.7.1
(function() {
  var getNanoSeconds, hrtime, loadTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

}).call(this,_dereq_("1YiZ5S"))
},{"1YiZ5S":1}],3:[function(_dereq_,module,exports){
var now = _dereq_('performance-now')
  , global = typeof window === 'undefined' ? {} : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = global['request' + suffix]
  , caf = global['cancel' + suffix] || global['cancelRequest' + suffix]
  , isNative = true

for(var i = 0; i < vendors.length && !raf; i++) {
  raf = global[vendors[i] + 'Request' + suffix]
  caf = global[vendors[i] + 'Cancel' + suffix]
      || global[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  isNative = false

  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  if(!isNative) {
    return raf.call(global, fn)
  }
  return raf.call(global, function() {
    try{
      fn.apply(this, arguments)
    } catch(e) {
      setTimeout(function() { throw e }, 0)
    }
  })
}
module.exports.cancel = function() {
  caf.apply(global, arguments)
}

},{"performance-now":4}],4:[function(_dereq_,module,exports){
(function (process){
// Generated by CoffeeScript 1.6.3
(function() {
  var getNanoSeconds, hrtime, loadTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

/*
//@ sourceMappingURL=performance-now.map
*/

}).call(this,_dereq_("1YiZ5S"))
},{"1YiZ5S":1}],5:[function(_dereq_,module,exports){
(function (process){
(function() {
  var Lockstep, MSQTY, NOOP, now, raf,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  raf = _dereq_('raf');

  now = _dereq_('performance-now');

  MSQTY = {};

  MSQTY.microseconds = 0.001;

  MSQTY.milliseconds = MSQTY.microseconds * 1000;

  MSQTY.seconds = MSQTY.milliseconds * 1000;

  MSQTY.minutes = MSQTY.seconds * 60;

  MSQTY.hours = MSQTY.minutes * 60;

  MSQTY.days = MSQTY.hours * 24;

  NOOP = function() {};

  Lockstep = (function() {
    function Lockstep() {
      this._loop = __bind(this._loop, this);
      var options;
      options = this._checkArguments(arguments);
      this.settings = this._buildSettings(options);
      this.running = false;
      this.microseconds = this._hasHighResolutionTime();
      this.count = {
        start: 0,
        stop: 0,
        reset: 0
      };
      this.time = {
        start: null,
        stop: null,
        run: 0
      };
    }

    Lockstep.prototype._type = function(value) {
      return {}.toString.call(value).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    };

    Lockstep.prototype._isInt = function(value) {
      return !isNaN(value) && parseInt(Number(value)) === value && !isNaN(parseInt(value, 10));
    };

    Lockstep.prototype._merge = function(obj1, obj2) {
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

    Lockstep.prototype._pad = function(int, length) {
      int += '';
      if (int.length >= length) {
        return int;
      } else {
        return "" + (new Array(length - int.length + 1).join('0')) + "int";
      }
    };

    Lockstep.prototype._hasHighResolutionTime = function() {
      var _ref;
      return ((typeof window !== "undefined" && window !== null ? (_ref = window.performance) != null ? _ref.now : void 0 : void 0) != null) || ((typeof process !== "undefined" && process !== null ? process.hrtime : void 0) != null);
    };

    Lockstep.prototype._checkArguments = function(args) {
      var options;
      if (args.length === 0) {
        throw new Error('No arguments supplied.');
      } else if (args.length === 1) {
        if (this._type(args[0]) === 'function') {
          options = {
            step: args[0]
          };
        } else if (this._type(args[0]) === 'object') {
          if (this._type(args[0].step) === 'function') {
            options = args[0];
          } else {
            throw new Error('Bad arguments supplied (no valid "step" function).');
          }
        } else {
          throw new Error('Bad arguments supplied (wrong type).');
        }
      } else if (args.length >= 2) {
        if (this._type(args[0]) === 'object' && this._type(args[1]) === 'function') {
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
        if (!(options.pad === false || this._isInt(options.pad))) {
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
      return this._merge(defaults, options);
    };

    Lockstep.prototype._runTimeToClockTime = function(runTime) {
      var clockTime, milliseconds;
      clockTime = {};
      if (this.microseconds) {
        clockTime.microseconds = Math.floor((runTime % 1) / MSQTY.microseconds);
        milliseconds = Math.floor(runTime);
      } else {
        milliseconds = runTime;
      }
      clockTime.milliseconds = milliseconds % 1000;
      clockTime.seconds = Math.floor(milliseconds / MSQTY.seconds) % 60;
      clockTime.minutes = Math.floor(milliseconds / MSQTY.minutes) % 60;
      clockTime.hours = Math.floor(milliseconds / MSQTY.hours) % 24;
      clockTime.days = Math.floor(milliseconds / MSQTY.days);
      return clockTime;
    };

    Lockstep.prototype._runTimeToElapsedTime = function(runTime) {
      var elapsedTime, milliseconds;
      elapsedTime = {};
      if (this.microseconds) {
        elapsedTime.microseconds = runTime / MSQTY.microseconds;
        milliseconds = runTime;
      } else {
        milliseconds = runTime;
      }
      elapsedTime.milliseconds = milliseconds;
      elapsedTime.seconds = milliseconds / MSQTY.seconds;
      elapsedTime.minutes = milliseconds / MSQTY.minutes;
      elapsedTime.hours = milliseconds / MSQTY.hours;
      elapsedTime.days = milliseconds / MSQTY.days;
      return elapsedTime;
    };

    Lockstep.prototype._getInfo = function() {
      var clock, elapsed, key, runTime, val;
      runTime = this.running ? this.time.run + now() - this.time.start : this.time.run;
      elapsed = this._runTimeToElapsedTime(runTime);
      clock = this._runTimeToClockTime(runTime);
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

    Lockstep.prototype._setInfo = function(info) {
      return this;
    };

    Lockstep.prototype._loop = function() {
      this.pulse = raf(this._loop);
      return this._step();
    };

    Lockstep.prototype._step = function() {
      return this.settings.step(this._getInfo());
    };

    Lockstep.prototype.info = function(info) {
      if (info != null) {
        if (this._type(info) === 'object') {
          return this._setInfo(info);
        } else {
          throw new Error('Bad arguments supplied (wrong type).');
        }
      } else {
        return this._getInfo();
      }
    };

    Lockstep.prototype.start = function(callback) {
      if (callback == null) {
        callback = this.settings.start;
      }
      if (!this.running) {
        this.count.start++;
        this.running = true;
        this.time.start = now();
        this._loop();
        if (typeof callback === "function") {
          callback(this._getInfo());
        }
      }
      return this;
    };

    Lockstep.prototype.stop = function(callback) {
      if (callback == null) {
        callback = this.settings.stop;
      }
      if (this.running) {
        raf.cancel(this.pulse);
        this.time.stop = now();
        this.time.run += this.time.stop - this.time.start;
        this.count.stop++;
        this.running = false;
        this._step();
        if (typeof callback === "function") {
          callback(this._getInfo());
        }
      }
      return this;
    };

    Lockstep.prototype.reset = function(callback, count) {
      var callbackEligible, key, val, _ref;
      if (callback == null) {
        callback = this.settings.reset;
      }
      if (this.time.run > 0) {
        callbackEligible = true;
        this.time.run = 0;
        this.count.reset++;
        this.time.start = now();
        this.time.stop = null;
      }
      if (count) {
        _ref = this.count;
        for (key in _ref) {
          val = _ref[key];
          if (val > 0) {
            callbackEligible = true;
            this.count.start = 0;
            this.count.stop = 0;
            this.count.reset = 0;
            break;
          }
        }
      }
      if ((callback != null) && callbackEligible) {
        if (this._type(callback) === 'function') {
          if (typeof callback === "function") {
            callback(this._getInfo());
          }
        } else {
          throw new Error('Bad arguments supplied (wrong type).');
        }
      }
      return this;
    };

    return Lockstep;

  })();

  module.exports = Lockstep;

}).call(this);

}).call(this,_dereq_("1YiZ5S"))
},{"1YiZ5S":1,"performance-now":2,"raf":3}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90d2Fyci9jb2RlL2xvY2tzdGVwL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy90d2Fyci9jb2RlL2xvY2tzdGVwL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi9Vc2Vycy90d2Fyci9jb2RlL2xvY2tzdGVwL25vZGVfbW9kdWxlcy9wZXJmb3JtYW5jZS1ub3cvbGliL3BlcmZvcm1hbmNlLW5vdy5qcyIsIi9Vc2Vycy90d2Fyci9jb2RlL2xvY2tzdGVwL25vZGVfbW9kdWxlcy9yYWYvaW5kZXguanMiLCIvVXNlcnMvdHdhcnIvY29kZS9sb2Nrc3RlcC9ub2RlX21vZHVsZXMvcmFmL25vZGVfbW9kdWxlcy9wZXJmb3JtYW5jZS1ub3cvbGliL3BlcmZvcm1hbmNlLW5vdy5qcyIsIi9Vc2Vycy90d2Fyci9jb2RlL2xvY2tzdGVwL3NyYy9mYWtlXzNiYTk1MmNjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCIoZnVuY3Rpb24gKHByb2Nlc3Mpe1xuLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjcuMVxuKGZ1bmN0aW9uKCkge1xuICB2YXIgZ2V0TmFub1NlY29uZHMsIGhydGltZSwgbG9hZFRpbWU7XG5cbiAgaWYgKCh0eXBlb2YgcGVyZm9ybWFuY2UgIT09IFwidW5kZWZpbmVkXCIgJiYgcGVyZm9ybWFuY2UgIT09IG51bGwpICYmIHBlcmZvcm1hbmNlLm5vdykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgfTtcbiAgfSBlbHNlIGlmICgodHlwZW9mIHByb2Nlc3MgIT09IFwidW5kZWZpbmVkXCIgJiYgcHJvY2VzcyAhPT0gbnVsbCkgJiYgcHJvY2Vzcy5ocnRpbWUpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIChnZXROYW5vU2Vjb25kcygpIC0gbG9hZFRpbWUpIC8gMWU2O1xuICAgIH07XG4gICAgaHJ0aW1lID0gcHJvY2Vzcy5ocnRpbWU7XG4gICAgZ2V0TmFub1NlY29uZHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBocjtcbiAgICAgIGhyID0gaHJ0aW1lKCk7XG4gICAgICByZXR1cm4gaHJbMF0gKiAxZTkgKyBoclsxXTtcbiAgICB9O1xuICAgIGxvYWRUaW1lID0gZ2V0TmFub1NlY29uZHMoKTtcbiAgfSBlbHNlIGlmIChEYXRlLm5vdykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gRGF0ZS5ub3coKSAtIGxvYWRUaW1lO1xuICAgIH07XG4gICAgbG9hZFRpbWUgPSBEYXRlLm5vdygpO1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBsb2FkVGltZTtcbiAgICB9O1xuICAgIGxvYWRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH1cblxufSkuY2FsbCh0aGlzKTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIxWWlaNVNcIikpIiwidmFyIG5vdyA9IHJlcXVpcmUoJ3BlcmZvcm1hbmNlLW5vdycpXG4gICwgZ2xvYmFsID0gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyB7fSA6IHdpbmRvd1xuICAsIHZlbmRvcnMgPSBbJ21veicsICd3ZWJraXQnXVxuICAsIHN1ZmZpeCA9ICdBbmltYXRpb25GcmFtZSdcbiAgLCByYWYgPSBnbG9iYWxbJ3JlcXVlc3QnICsgc3VmZml4XVxuICAsIGNhZiA9IGdsb2JhbFsnY2FuY2VsJyArIHN1ZmZpeF0gfHwgZ2xvYmFsWydjYW5jZWxSZXF1ZXN0JyArIHN1ZmZpeF1cbiAgLCBpc05hdGl2ZSA9IHRydWVcblxuZm9yKHZhciBpID0gMDsgaSA8IHZlbmRvcnMubGVuZ3RoICYmICFyYWY7IGkrKykge1xuICByYWYgPSBnbG9iYWxbdmVuZG9yc1tpXSArICdSZXF1ZXN0JyArIHN1ZmZpeF1cbiAgY2FmID0gZ2xvYmFsW3ZlbmRvcnNbaV0gKyAnQ2FuY2VsJyArIHN1ZmZpeF1cbiAgICAgIHx8IGdsb2JhbFt2ZW5kb3JzW2ldICsgJ0NhbmNlbFJlcXVlc3QnICsgc3VmZml4XVxufVxuXG4vLyBTb21lIHZlcnNpb25zIG9mIEZGIGhhdmUgckFGIGJ1dCBub3QgY0FGXG5pZighcmFmIHx8ICFjYWYpIHtcbiAgaXNOYXRpdmUgPSBmYWxzZVxuXG4gIHZhciBsYXN0ID0gMFxuICAgICwgaWQgPSAwXG4gICAgLCBxdWV1ZSA9IFtdXG4gICAgLCBmcmFtZUR1cmF0aW9uID0gMTAwMCAvIDYwXG5cbiAgcmFmID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICBpZihxdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHZhciBfbm93ID0gbm93KClcbiAgICAgICAgLCBuZXh0ID0gTWF0aC5tYXgoMCwgZnJhbWVEdXJhdGlvbiAtIChfbm93IC0gbGFzdCkpXG4gICAgICBsYXN0ID0gbmV4dCArIF9ub3dcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjcCA9IHF1ZXVlLnNsaWNlKDApXG4gICAgICAgIC8vIENsZWFyIHF1ZXVlIGhlcmUgdG8gcHJldmVudFxuICAgICAgICAvLyBjYWxsYmFja3MgZnJvbSBhcHBlbmRpbmcgbGlzdGVuZXJzXG4gICAgICAgIC8vIHRvIHRoZSBjdXJyZW50IGZyYW1lJ3MgcXVldWVcbiAgICAgICAgcXVldWUubGVuZ3RoID0gMFxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgY3AubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZighY3BbaV0uY2FuY2VsbGVkKSB7XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgIGNwW2ldLmNhbGxiYWNrKGxhc3QpXG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgdGhyb3cgZSB9LCAwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgTWF0aC5yb3VuZChuZXh0KSlcbiAgICB9XG4gICAgcXVldWUucHVzaCh7XG4gICAgICBoYW5kbGU6ICsraWQsXG4gICAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgICBjYW5jZWxsZWQ6IGZhbHNlXG4gICAgfSlcbiAgICByZXR1cm4gaWRcbiAgfVxuXG4gIGNhZiA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYocXVldWVbaV0uaGFuZGxlID09PSBoYW5kbGUpIHtcbiAgICAgICAgcXVldWVbaV0uY2FuY2VsbGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuKSB7XG4gIC8vIFdyYXAgaW4gYSBuZXcgZnVuY3Rpb24gdG8gcHJldmVudFxuICAvLyBgY2FuY2VsYCBwb3RlbnRpYWxseSBiZWluZyBhc3NpZ25lZFxuICAvLyB0byB0aGUgbmF0aXZlIHJBRiBmdW5jdGlvblxuICBpZighaXNOYXRpdmUpIHtcbiAgICByZXR1cm4gcmFmLmNhbGwoZ2xvYmFsLCBmbilcbiAgfVxuICByZXR1cm4gcmFmLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbigpIHtcbiAgICB0cnl7XG4gICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB0aHJvdyBlIH0sIDApXG4gICAgfVxuICB9KVxufVxubW9kdWxlLmV4cG9ydHMuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG4gIGNhZi5hcHBseShnbG9iYWwsIGFyZ3VtZW50cylcbn1cbiIsIihmdW5jdGlvbiAocHJvY2Vzcyl7XG4vLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuNi4zXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBnZXROYW5vU2Vjb25kcywgaHJ0aW1lLCBsb2FkVGltZTtcblxuICBpZiAoKHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwZXJmb3JtYW5jZSAhPT0gbnVsbCkgJiYgcGVyZm9ybWFuY2Uubm93KSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB9O1xuICB9IGVsc2UgaWYgKCh0eXBlb2YgcHJvY2VzcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwcm9jZXNzICE9PSBudWxsKSAmJiBwcm9jZXNzLmhydGltZSkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gKGdldE5hbm9TZWNvbmRzKCkgLSBsb2FkVGltZSkgLyAxZTY7XG4gICAgfTtcbiAgICBocnRpbWUgPSBwcm9jZXNzLmhydGltZTtcbiAgICBnZXROYW5vU2Vjb25kcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGhyO1xuICAgICAgaHIgPSBocnRpbWUoKTtcbiAgICAgIHJldHVybiBoclswXSAqIDFlOSArIGhyWzFdO1xuICAgIH07XG4gICAgbG9hZFRpbWUgPSBnZXROYW5vU2Vjb25kcygpO1xuICB9IGVsc2UgaWYgKERhdGUubm93KSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBEYXRlLm5vdygpIC0gbG9hZFRpbWU7XG4gICAgfTtcbiAgICBsb2FkVGltZSA9IERhdGUubm93KCk7XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGxvYWRUaW1lO1xuICAgIH07XG4gICAgbG9hZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfVxuXG59KS5jYWxsKHRoaXMpO1xuXG4vKlxuLy9AIHNvdXJjZU1hcHBpbmdVUkw9cGVyZm9ybWFuY2Utbm93Lm1hcFxuKi9cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIxWWlaNVNcIikpIiwiKGZ1bmN0aW9uIChwcm9jZXNzKXtcbihmdW5jdGlvbigpIHtcbiAgdmFyIExvY2tzdGVwLCBNU1FUWSwgTk9PUCwgbm93LCByYWYsXG4gICAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfTtcblxuICByYWYgPSByZXF1aXJlKCdyYWYnKTtcblxuICBub3cgPSByZXF1aXJlKCdwZXJmb3JtYW5jZS1ub3cnKTtcblxuICBNU1FUWSA9IHt9O1xuXG4gIE1TUVRZLm1pY3Jvc2Vjb25kcyA9IDAuMDAxO1xuXG4gIE1TUVRZLm1pbGxpc2Vjb25kcyA9IE1TUVRZLm1pY3Jvc2Vjb25kcyAqIDEwMDA7XG5cbiAgTVNRVFkuc2Vjb25kcyA9IE1TUVRZLm1pbGxpc2Vjb25kcyAqIDEwMDA7XG5cbiAgTVNRVFkubWludXRlcyA9IE1TUVRZLnNlY29uZHMgKiA2MDtcblxuICBNU1FUWS5ob3VycyA9IE1TUVRZLm1pbnV0ZXMgKiA2MDtcblxuICBNU1FUWS5kYXlzID0gTVNRVFkuaG91cnMgKiAyNDtcblxuICBOT09QID0gZnVuY3Rpb24oKSB7fTtcblxuICBMb2Nrc3RlcCA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBMb2Nrc3RlcCgpIHtcbiAgICAgIHRoaXMuX2xvb3AgPSBfX2JpbmQodGhpcy5fbG9vcCwgdGhpcyk7XG4gICAgICB2YXIgb3B0aW9ucztcbiAgICAgIG9wdGlvbnMgPSB0aGlzLl9jaGVja0FyZ3VtZW50cyhhcmd1bWVudHMpO1xuICAgICAgdGhpcy5zZXR0aW5ncyA9IHRoaXMuX2J1aWxkU2V0dGluZ3Mob3B0aW9ucyk7XG4gICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMubWljcm9zZWNvbmRzID0gdGhpcy5faGFzSGlnaFJlc29sdXRpb25UaW1lKCk7XG4gICAgICB0aGlzLmNvdW50ID0ge1xuICAgICAgICBzdGFydDogMCxcbiAgICAgICAgc3RvcDogMCxcbiAgICAgICAgcmVzZXQ6IDBcbiAgICAgIH07XG4gICAgICB0aGlzLnRpbWUgPSB7XG4gICAgICAgIHN0YXJ0OiBudWxsLFxuICAgICAgICBzdG9wOiBudWxsLFxuICAgICAgICBydW46IDBcbiAgICAgIH07XG4gICAgfVxuXG4gICAgTG9ja3N0ZXAucHJvdG90eXBlLl90eXBlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB7fS50b1N0cmluZy5jYWxsKHZhbHVlKS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpO1xuICAgIH07XG5cbiAgICBMb2Nrc3RlcC5wcm90b3R5cGUuX2lzSW50ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiAhaXNOYU4odmFsdWUpICYmIHBhcnNlSW50KE51bWJlcih2YWx1ZSkpID09PSB2YWx1ZSAmJiAhaXNOYU4ocGFyc2VJbnQodmFsdWUsIDEwKSk7XG4gICAgfTtcblxuICAgIExvY2tzdGVwLnByb3RvdHlwZS5fbWVyZ2UgPSBmdW5jdGlvbihvYmoxLCBvYmoyKSB7XG4gICAgICB2YXIgbmFtZSwgb2JqMztcbiAgICAgIG9iajMgPSB7fTtcbiAgICAgIGZvciAobmFtZSBpbiBvYmoxKSB7XG4gICAgICAgIG9iajNbbmFtZV0gPSBvYmoxW25hbWVdO1xuICAgICAgfVxuICAgICAgZm9yIChuYW1lIGluIG9iajIpIHtcbiAgICAgICAgb2JqM1tuYW1lXSA9IG9iajJbbmFtZV07XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqMztcbiAgICB9O1xuXG4gICAgTG9ja3N0ZXAucHJvdG90eXBlLl9wYWQgPSBmdW5jdGlvbihpbnQsIGxlbmd0aCkge1xuICAgICAgaW50ICs9ICcnO1xuICAgICAgaWYgKGludC5sZW5ndGggPj0gbGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBpbnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJcIiArIChuZXcgQXJyYXkobGVuZ3RoIC0gaW50Lmxlbmd0aCArIDEpLmpvaW4oJzAnKSkgKyBcImludFwiO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBMb2Nrc3RlcC5wcm90b3R5cGUuX2hhc0hpZ2hSZXNvbHV0aW9uVGltZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIF9yZWY7XG4gICAgICByZXR1cm4gKCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdyAhPT0gbnVsbCA/IChfcmVmID0gd2luZG93LnBlcmZvcm1hbmNlKSAhPSBudWxsID8gX3JlZi5ub3cgOiB2b2lkIDAgOiB2b2lkIDApICE9IG51bGwpIHx8ICgodHlwZW9mIHByb2Nlc3MgIT09IFwidW5kZWZpbmVkXCIgJiYgcHJvY2VzcyAhPT0gbnVsbCA/IHByb2Nlc3MuaHJ0aW1lIDogdm9pZCAwKSAhPSBudWxsKTtcbiAgICB9O1xuXG4gICAgTG9ja3N0ZXAucHJvdG90eXBlLl9jaGVja0FyZ3VtZW50cyA9IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICAgIHZhciBvcHRpb25zO1xuICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gYXJndW1lbnRzIHN1cHBsaWVkLicpO1xuICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpZiAodGhpcy5fdHlwZShhcmdzWzBdKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBzdGVwOiBhcmdzWzBdXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl90eXBlKGFyZ3NbMF0pID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGlmICh0aGlzLl90eXBlKGFyZ3NbMF0uc3RlcCkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBhcmdzWzBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBhcmd1bWVudHMgc3VwcGxpZWQgKG5vIHZhbGlkIFwic3RlcFwiIGZ1bmN0aW9uKS4nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgYXJndW1lbnRzIHN1cHBsaWVkICh3cm9uZyB0eXBlKS4nKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgIGlmICh0aGlzLl90eXBlKGFyZ3NbMF0pID09PSAnb2JqZWN0JyAmJiB0aGlzLl90eXBlKGFyZ3NbMV0pID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgaWYgKGFyZ3NbMF0uc3RlcCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBhcmd1bWVudHMgc3VwcGxpZWQgKHJlZHVuZGFudCBcInN0ZXBcIiBmdW5jdGlvbikuJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyZ3NbMF0uc3RlcCA9IGFyZ3NbMV07XG4gICAgICAgICAgICBvcHRpb25zID0gYXJnc1swXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgYXJndW1lbnRzIHN1cHBsaWVkICh3cm9uZyB0eXBlKS4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMucGFkICE9IG51bGwpIHtcbiAgICAgICAgaWYgKCEob3B0aW9ucy5wYWQgPT09IGZhbHNlIHx8IHRoaXMuX2lzSW50KG9wdGlvbnMucGFkKSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBhcmd1bWVudHMgc3VwcGxpZWQgKFwicGFkXCIgb3B0aW9uIG11c3QgaGF2ZSBhIGZhbHNlIG9yIGludGVnZXIgdmFsdWUpLicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9O1xuXG4gICAgTG9ja3N0ZXAucHJvdG90eXBlLl9idWlsZFNldHRpbmdzID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdmFyIGRlZmF1bHRzO1xuICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgIHBhZDogZmFsc2UsXG4gICAgICAgIGZsb29yOiBmYWxzZVxuICAgICAgfTtcbiAgICAgIHJldHVybiB0aGlzLl9tZXJnZShkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgfTtcblxuICAgIExvY2tzdGVwLnByb3RvdHlwZS5fcnVuVGltZVRvQ2xvY2tUaW1lID0gZnVuY3Rpb24ocnVuVGltZSkge1xuICAgICAgdmFyIGNsb2NrVGltZSwgbWlsbGlzZWNvbmRzO1xuICAgICAgY2xvY2tUaW1lID0ge307XG4gICAgICBpZiAodGhpcy5taWNyb3NlY29uZHMpIHtcbiAgICAgICAgY2xvY2tUaW1lLm1pY3Jvc2Vjb25kcyA9IE1hdGguZmxvb3IoKHJ1blRpbWUgJSAxKSAvIE1TUVRZLm1pY3Jvc2Vjb25kcyk7XG4gICAgICAgIG1pbGxpc2Vjb25kcyA9IE1hdGguZmxvb3IocnVuVGltZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtaWxsaXNlY29uZHMgPSBydW5UaW1lO1xuICAgICAgfVxuICAgICAgY2xvY2tUaW1lLm1pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kcyAlIDEwMDA7XG4gICAgICBjbG9ja1RpbWUuc2Vjb25kcyA9IE1hdGguZmxvb3IobWlsbGlzZWNvbmRzIC8gTVNRVFkuc2Vjb25kcykgJSA2MDtcbiAgICAgIGNsb2NrVGltZS5taW51dGVzID0gTWF0aC5mbG9vcihtaWxsaXNlY29uZHMgLyBNU1FUWS5taW51dGVzKSAlIDYwO1xuICAgICAgY2xvY2tUaW1lLmhvdXJzID0gTWF0aC5mbG9vcihtaWxsaXNlY29uZHMgLyBNU1FUWS5ob3VycykgJSAyNDtcbiAgICAgIGNsb2NrVGltZS5kYXlzID0gTWF0aC5mbG9vcihtaWxsaXNlY29uZHMgLyBNU1FUWS5kYXlzKTtcbiAgICAgIHJldHVybiBjbG9ja1RpbWU7XG4gICAgfTtcblxuICAgIExvY2tzdGVwLnByb3RvdHlwZS5fcnVuVGltZVRvRWxhcHNlZFRpbWUgPSBmdW5jdGlvbihydW5UaW1lKSB7XG4gICAgICB2YXIgZWxhcHNlZFRpbWUsIG1pbGxpc2Vjb25kcztcbiAgICAgIGVsYXBzZWRUaW1lID0ge307XG4gICAgICBpZiAodGhpcy5taWNyb3NlY29uZHMpIHtcbiAgICAgICAgZWxhcHNlZFRpbWUubWljcm9zZWNvbmRzID0gcnVuVGltZSAvIE1TUVRZLm1pY3Jvc2Vjb25kcztcbiAgICAgICAgbWlsbGlzZWNvbmRzID0gcnVuVGltZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1pbGxpc2Vjb25kcyA9IHJ1blRpbWU7XG4gICAgICB9XG4gICAgICBlbGFwc2VkVGltZS5taWxsaXNlY29uZHMgPSBtaWxsaXNlY29uZHM7XG4gICAgICBlbGFwc2VkVGltZS5zZWNvbmRzID0gbWlsbGlzZWNvbmRzIC8gTVNRVFkuc2Vjb25kcztcbiAgICAgIGVsYXBzZWRUaW1lLm1pbnV0ZXMgPSBtaWxsaXNlY29uZHMgLyBNU1FUWS5taW51dGVzO1xuICAgICAgZWxhcHNlZFRpbWUuaG91cnMgPSBtaWxsaXNlY29uZHMgLyBNU1FUWS5ob3VycztcbiAgICAgIGVsYXBzZWRUaW1lLmRheXMgPSBtaWxsaXNlY29uZHMgLyBNU1FUWS5kYXlzO1xuICAgICAgcmV0dXJuIGVsYXBzZWRUaW1lO1xuICAgIH07XG5cbiAgICBMb2Nrc3RlcC5wcm90b3R5cGUuX2dldEluZm8gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjbG9jaywgZWxhcHNlZCwga2V5LCBydW5UaW1lLCB2YWw7XG4gICAgICBydW5UaW1lID0gdGhpcy5ydW5uaW5nID8gdGhpcy50aW1lLnJ1biArIG5vdygpIC0gdGhpcy50aW1lLnN0YXJ0IDogdGhpcy50aW1lLnJ1bjtcbiAgICAgIGVsYXBzZWQgPSB0aGlzLl9ydW5UaW1lVG9FbGFwc2VkVGltZShydW5UaW1lKTtcbiAgICAgIGNsb2NrID0gdGhpcy5fcnVuVGltZVRvQ2xvY2tUaW1lKHJ1blRpbWUpO1xuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZmxvb3IpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gZWxhcHNlZCkge1xuICAgICAgICAgIHZhbCA9IGVsYXBzZWRba2V5XTtcbiAgICAgICAgICBlbGFwc2VkID0gTWF0aC5mbG9vcih2YWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy5wYWQpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gY2xvY2spIHtcbiAgICAgICAgICB2YWwgPSBjbG9ja1trZXldO1xuICAgICAgICAgIHZhbCA9IHRoaXMuX3BhZCh2YWwsIHRoaXMuc2V0dGluZ3MucGFkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGltZToge1xuICAgICAgICAgIGVsYXBzZWQ6IGVsYXBzZWQsXG4gICAgICAgICAgY2xvY2s6IGNsb2NrXG4gICAgICAgIH0sXG4gICAgICAgIGNvdW50OiB0aGlzLmNvdW50XG4gICAgICB9O1xuICAgIH07XG5cbiAgICBMb2Nrc3RlcC5wcm90b3R5cGUuX3NldEluZm8gPSBmdW5jdGlvbihpbmZvKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgTG9ja3N0ZXAucHJvdG90eXBlLl9sb29wID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnB1bHNlID0gcmFmKHRoaXMuX2xvb3ApO1xuICAgICAgcmV0dXJuIHRoaXMuX3N0ZXAoKTtcbiAgICB9O1xuXG4gICAgTG9ja3N0ZXAucHJvdG90eXBlLl9zdGVwID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXR0aW5ncy5zdGVwKHRoaXMuX2dldEluZm8oKSk7XG4gICAgfTtcblxuICAgIExvY2tzdGVwLnByb3RvdHlwZS5pbmZvID0gZnVuY3Rpb24oaW5mbykge1xuICAgICAgaWYgKGluZm8gIT0gbnVsbCkge1xuICAgICAgICBpZiAodGhpcy5fdHlwZShpbmZvKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fc2V0SW5mbyhpbmZvKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBhcmd1bWVudHMgc3VwcGxpZWQgKHdyb25nIHR5cGUpLicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0SW5mbygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBMb2Nrc3RlcC5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgaWYgKGNhbGxiYWNrID09IG51bGwpIHtcbiAgICAgICAgY2FsbGJhY2sgPSB0aGlzLnNldHRpbmdzLnN0YXJ0O1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgdGhpcy5jb3VudC5zdGFydCsrO1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnRpbWUuc3RhcnQgPSBub3coKTtcbiAgICAgICAgdGhpcy5fbG9vcCgpO1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBjYWxsYmFjayh0aGlzLl9nZXRJbmZvKCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgTG9ja3N0ZXAucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgaWYgKGNhbGxiYWNrID09IG51bGwpIHtcbiAgICAgICAgY2FsbGJhY2sgPSB0aGlzLnNldHRpbmdzLnN0b3A7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5ydW5uaW5nKSB7XG4gICAgICAgIHJhZi5jYW5jZWwodGhpcy5wdWxzZSk7XG4gICAgICAgIHRoaXMudGltZS5zdG9wID0gbm93KCk7XG4gICAgICAgIHRoaXMudGltZS5ydW4gKz0gdGhpcy50aW1lLnN0b3AgLSB0aGlzLnRpbWUuc3RhcnQ7XG4gICAgICAgIHRoaXMuY291bnQuc3RvcCsrO1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc3RlcCgpO1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBjYWxsYmFjayh0aGlzLl9nZXRJbmZvKCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgTG9ja3N0ZXAucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oY2FsbGJhY2ssIGNvdW50KSB7XG4gICAgICB2YXIgY2FsbGJhY2tFbGlnaWJsZSwga2V5LCB2YWwsIF9yZWY7XG4gICAgICBpZiAoY2FsbGJhY2sgPT0gbnVsbCkge1xuICAgICAgICBjYWxsYmFjayA9IHRoaXMuc2V0dGluZ3MucmVzZXQ7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy50aW1lLnJ1biA+IDApIHtcbiAgICAgICAgY2FsbGJhY2tFbGlnaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMudGltZS5ydW4gPSAwO1xuICAgICAgICB0aGlzLmNvdW50LnJlc2V0Kys7XG4gICAgICAgIHRoaXMudGltZS5zdGFydCA9IG5vdygpO1xuICAgICAgICB0aGlzLnRpbWUuc3RvcCA9IG51bGw7XG4gICAgICB9XG4gICAgICBpZiAoY291bnQpIHtcbiAgICAgICAgX3JlZiA9IHRoaXMuY291bnQ7XG4gICAgICAgIGZvciAoa2V5IGluIF9yZWYpIHtcbiAgICAgICAgICB2YWwgPSBfcmVmW2tleV07XG4gICAgICAgICAgaWYgKHZhbCA+IDApIHtcbiAgICAgICAgICAgIGNhbGxiYWNrRWxpZ2libGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5jb3VudC5zdGFydCA9IDA7XG4gICAgICAgICAgICB0aGlzLmNvdW50LnN0b3AgPSAwO1xuICAgICAgICAgICAgdGhpcy5jb3VudC5yZXNldCA9IDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICgoY2FsbGJhY2sgIT0gbnVsbCkgJiYgY2FsbGJhY2tFbGlnaWJsZSkge1xuICAgICAgICBpZiAodGhpcy5fdHlwZShjYWxsYmFjaykgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMuX2dldEluZm8oKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIGFyZ3VtZW50cyBzdXBwbGllZCAod3JvbmcgdHlwZSkuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICByZXR1cm4gTG9ja3N0ZXA7XG5cbiAgfSkoKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IExvY2tzdGVwO1xuXG59KS5jYWxsKHRoaXMpO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIjFZaVo1U1wiKSkiXX0=
(5)
});
