// shortcuts
var $buttonStart = $('button.start'),
    $buttonStop = $('button.stop'),
    $buttonReset = $('button.reset'),
    $buttonResetCount = $('button.resetCount'),
    $countStart = $('.start td'),
    $countStop = $('.stop td'),
    $countReset = $('.reset td'),
    $clockMicroseconds = $('.clock .microseconds td'),
    $clockMilliseconds = $('.clock .milliseconds td'),
    $clockSeconds = $('.clock .seconds td'),
    $clockMinutes = $('.clock .minutes td'),
    $clockHours = $('.clock .hours td'),
    $clockDays = $('.clock .days td'),
    $elapsedMicroseconds = $('.elapsed .microseconds td'),
    $elapsedMilliseconds = $('.elapsed .milliseconds td'),
    $elapsedSeconds = $('.elapsed .seconds td'),
    $elapsedMinutes = $('.elapsed .minutes td'),
    $elapsedHours = $('.elapsed .hours td'),
    $elapsedDays = $('.elapsed .days td');

// update everything
var update = function(info) {
      // clock
      $clockMicroseconds.text(info.time.clock.microseconds);
      $clockMilliseconds.text(info.time.clock.milliseconds);
      $clockSeconds.text(info.time.clock.seconds);
      $clockMinutes.text(info.time.clock.minutes);
      $clockHours.text(info.time.clock.hours);
      $clockDays.text(info.time.clock.days);
      // elapsed
      $elapsedMicroseconds.text(info.time.elapsed.microseconds);
      $elapsedMilliseconds.text(info.time.elapsed.milliseconds);
      $elapsedSeconds.text(info.time.elapsed.seconds);
      $elapsedMinutes.text(info.time.elapsed.minutes);
      $elapsedHours.text(info.time.elapsed.hours);
      $elapsedDays.text(info.time.elapsed.days);
      // count
      $countStart.text(info.count.start);
      $countStop.text(info.count.stop);
      $countReset.text(info.count.reset);
    };

// create a new Lockstep instance
var lockstep = new Lockstep(update);

// set up event handlers for buttons
$buttonStart.click(function() {
  lockstep.start(update);
});
$buttonStop.click(function() {
  lockstep.stop(update);
});
$buttonReset.click(function() {
  lockstep.reset(update);
});
$buttonResetCount.click(function() {
  lockstep.reset(update, true);
});
