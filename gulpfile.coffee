# dependencies
gulp =        require 'gulp'
coffee =      require 'gulp-coffee'
gulpIf =      require 'gulp-if'
rename =      require 'gulp-rename'
notify =      require 'gulp-notify'
uglify =      require 'gulp-uglify'
less =        require 'gulp-less'
jade =        require 'gulp-jade'
browserify  = require 'gulp-browserify'
browserSync = require 'browser-sync'
del =         require 'del'
runSequence = require 'run-sequence'
streamQueue = require 'streamqueue'
yargs =       require 'yargs'



# environment
PROD = yargs.argv.prod
DEV = !PROD

# paths
paths =
  src: 'src/'
  dist: 'dist/'
  example: 'example/'
  start: 'example/index.html'



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
    .src "#{paths.src}main.coffee"
    .pipe coffee()
    .pipe browserify
      standalone: 'Lockstep'
      debug: true
    .pipe rename 'lockstep.js'
    .pipe gulp.dest paths.dist
    .pipe rename 'lockstep.min.js'
    .pipe uglify()
    .pipe gulp.dest paths.dist
    .pipe gulpIf DEV, browserSync.reload
      stream: true

# compile LESS
gulp.task 'styles', ->
  gulp
    .src "#{paths.example}main.less"
    .pipe less()
    .pipe gulp.dest "#{paths.dist}example/"
    .pipe gulpIf DEV, browserSync.reload
      stream: true

# copy HTML
gulp.task 'html', ->
  gulp
    .src "#{paths.example}index.jade"
    .pipe jade()
    .pipe gulp.dest "#{paths.dist}example/"
    .pipe gulpIf DEV, browserSync.reload
      stream: true

# copy example script
gulp.task 'script-example', ->
  gulp
    .src "#{paths.example}main.js"
    .pipe gulp.dest "#{paths.dist}example/"

# watch for changes
gulp.task 'watch', ->
  gulp.watch "#{paths.src}**/*.coffee", ['scripts']
  gulp.watch "#{paths.example}**/*.jade", ['html']
  gulp.watch "#{paths.example}**/*.less", ['styles']
  gulp.watch "#{paths.example}**/*.js", ['script-example']

# default task: call with 'gulp' on command line
gulp.task 'default', ->
  runSequence 'clean', 'html', 'styles', 'script-example', 'scripts', ->
    if DEV
      runSequence 'watch', 'browser-sync'
