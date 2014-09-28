# dependencies
gulp =        require 'gulp'
coffee =      require 'gulp-coffee'
gulpIf =      require 'gulp-if'
rename =      require 'gulp-rename'
notify =      require 'gulp-notify'
uglify =      require 'gulp-uglify'
jade =        require 'gulp-jade'
browserSync = require 'browser-sync'
del =         require 'del'
runSequence = require 'run-sequence'
streamQueue = require 'streamqueue'
yargs =       require 'yargs'
mocha =       require 'mocha' # TODO: use
chai =        require 'chai' # TODO: use



# environment
PROD = yargs.argv.prod
DEV = !PROD

# paths
paths =
  src: 'src/'
  dist: 'dist/'
  start: 'index.html'



# BrowserSync
gulp.task 'browser-sync', ->
  browserSync
    server:
      baseDir: paths.dist
      directory: true
    port: 2001
    browser: 'google chrome'
    startPath: paths.start



# clean out dist folder
gulp.task 'clean', (done) ->
  del paths.dist, done



# compile & minify scripts
gulp.task 'scripts', ->
  gulp
    .src "#{paths.src}index.coffee"
    .pipe coffee()
    .pipe rename 'lockstep.js'
    .pipe gulp.dest paths.dist
    .pipe rename 'lockstep.min.js'
    .pipe uglify()
    .pipe gulp.dest paths.dist
    .pipe gulpIf DEV, browserSync.reload
      stream: true



# copy HTML
gulp.task 'html', ->
  gulp
    .src "#{paths.src}index.jade"
    .pipe jade()
    .pipe gulp.dest paths.dist
    .pipe gulpIf DEV, browserSync.reload
      stream: true



# watch for changes
gulp.task 'watch', ->
  gulp.watch "#{paths.src}scripts/**/*", ['scripts']
  gulp.watch "#{paths.src}*.jade", ['html']



# default task: call with 'gulp' on command line
gulp.task 'default', ->
  runSequence 'clean', 'html', 'scripts', ->
    if DEV
      runSequence 'watch', 'browser-sync'
