// shortcuts
var $inputs = $('input'),
    button = {
      $start: $('button.start'),
      $stop: $('button.stop'),
      $reset: $('button.reset'),
      $resetCount: $('button.resetCount'),
      $set: $('button.set'),
      $add: $('button.add'),
      $subtract: $('button.subtract'),
      $clear: $('button.clear')
    },
    count = {
      input: {
        $start: $('.start input'),
        $stop: $('.stop input'),
        $reset: $('.reset input')
      },
      output: {
        $start: $('.start .output'),
        $stop: $('.stop .output'),
        $reset: $('.reset .output')
      }
    },
    clock = {
      input: {
        $microseconds: $('.clock .microseconds input'),
        $milliseconds: $('.clock .milliseconds input'),
        $seconds: $('.clock .seconds input'),
        $minutes: $('.clock .minutes input'),
        $hours: $('.clock .hours input'),
        $days: $('.clock .days input')
      },
      output: {
        $microseconds: $('.clock .microseconds .output'),
        $milliseconds: $('.clock .milliseconds .output'),
        $seconds: $('.clock .seconds .output'),
        $minutes: $('.clock .minutes .output'),
        $hours: $('.clock .hours .output'),
        $days: $('.clock .days .output')
      }
    },
    elapsed = {
      input: {
        $microseconds: $('.elapsed .microseconds input'),
        $milliseconds: $('.elapsed .milliseconds input'),
        $seconds: $('.elapsed .seconds input'),
        $minutes: $('.elapsed .minutes input'),
        $hours: $('.elapsed .hours input'),
        $days: $('.elapsed .days input')
      },
      output: {
        $microseconds: $('.elapsed .microseconds .output'),
        $milliseconds: $('.elapsed .milliseconds .output'),
        $seconds: $('.elapsed .seconds .output'),
        $minutes: $('.elapsed .minutes .output'),
        $hours: $('.elapsed .hours .output'),
        $days: $('.elapsed .days .output')
      }
    };

// update everything
var update = function(info) {
      // clock
      clock.output.$microseconds.text(info.time.clock.microseconds);
      clock.output.$milliseconds.text(info.time.clock.milliseconds);
      clock.output.$seconds.text(info.time.clock.seconds);
      clock.output.$minutes.text(info.time.clock.minutes);
      clock.output.$hours.text(info.time.clock.hours);
      clock.output.$days.text(info.time.clock.days);
      // elapsed
      elapsed.output.$microseconds.text(info.time.elapsed.microseconds);
      elapsed.output.$milliseconds.text(info.time.elapsed.milliseconds);
      elapsed.output.$seconds.text(info.time.elapsed.seconds);
      elapsed.output.$minutes.text(info.time.elapsed.minutes);
      elapsed.output.$hours.text(info.time.elapsed.hours);
      elapsed.output.$days.text(info.time.elapsed.days);
      // count
      count.output.$start.text(info.count.start);
      count.output.$stop.text(info.count.stop);
      count.output.$reset.text(info.count.reset);
    };

// validate
var validate = function(obj) {
      for(val in obj) {
        if(isNaN(obj[val])) {
          delete obj[val];
        }
      }
      return obj;
    };

// gather
var gather = function(type) {
      switch(type) {
        case 'clock':
          return {
            clock: validate({
              microseconds: parseFloat(clock.input.$microseconds.val(), 10),
              milliseconds: parseFloat(clock.input.$milliseconds.val(), 10),
              seconds: parseFloat(clock.input.$seconds.val(), 10),
              minutes: parseFloat(clock.input.$minutes.val(), 10),
              hours: parseFloat(clock.input.$hours.val(), 10),
              days: parseFloat(clock.input.$days.val(), 10)
            })
          };
        case 'elapsed':
          return {
            elapsed: validate({
              microseconds: parseFloat(elapsed.input.$microseconds.val(), 10),
              milliseconds: parseFloat(elapsed.input.$milliseconds.val(), 10),
              seconds: parseFloat(elapsed.input.$seconds.val(), 10),
              minutes: parseFloat(elapsed.input.$minutes.val(), 10),
              hours: parseFloat(elapsed.input.$hours.val(), 10),
              days: parseFloat(elapsed.input.$days.val(), 10)
            })
          };
        case 'count':
          return {
            count: validate({
              start: parseFloat(count.input.$start.val(), 10),
              stop: parseFloat(count.input.$stop.val(), 10),
              reset: parseFloat(count.input.$reset.val(), 10)
            })
          };
      }
    };

//
var getValues = function() {
      var checkedValues = $('input[name="type"]:checked').map(function() {
            return this.value;
          }).get(),
          values = [],
          i;
      for (i = 0; i < checkedValues.length; i++) {
        values.push(gather(checkedValues[i]));
      }
      return values;
    };

// create a new Lockstep instance
var lockstep = new Lockstep(update);

// "Start" button
button.$start.click(function() {
  lockstep.start(update);
});

// "Stop" button
button.$stop.click(function() {
  lockstep.stop(update);
});

// "Reset" button
button.$reset.click(function() {
  lockstep.reset(update);
});

// "Reset with Count" button
button.$resetCount.click(function() {
  lockstep.reset(update, true);
});

// "Set" button
button.$set.click(function() {
  var values = getValues(),
      i;
  for (i = 0; i < values.length; i++) {
    lockstep.info(values[i], update);
  }
});

// "Add" button
button.$add.click(function() {
  var values = getValues(),
      i;
  for (i = 0; i < values.length; i++) {
    lockstep.add(values[i], update);
  }
});

// "Subtract" button
button.$subtract.click(function() {
  var values = getValues(),
      i;
  for (i = 0; i < values.length; i++) {
    lockstep.subtract(values[i], update);
  }
});

// "Clear" button
button.$clear.click(function() {
  $inputs.val('');
});
