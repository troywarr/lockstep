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
bump        = require 'gulp-bump'
browserSync = require 'browser-sync'
del =         require 'del'
runSequence = require 'run-sequence'
streamQueue = require 'streamqueue'
yargs =       require 'yargs'



# shortcuts
argv = yargs.argv

# environment
PROD = argv.prod
DEV = !PROD

# paths
paths =
  root: ''
  src: 'src/'
  dist: 'dist/'
  example: 'example/'
  start: 'example/index.html'



# error handling
handleError = (err) ->
  notify.onError(
    message: "Error: #{err.message}"
  )(err)
  console.log err.toString()
  @emit 'end'



# bump version
#   e.g., `gulp bump --minor`
gulp.task 'bump', ->
  gulp
    .src ["#{paths.root}bower.json", "#{paths.root}package.json"]
    .pipe bump
      type: switch
        when argv.major then 'major'
        when argv.minor then 'minor'
        else 'patch'
    .pipe gulp.dest paths.root



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
    .on 'error', handleError
    .pipe browserify
      standalone: 'Lockstep'
      debug: true
    .on 'error', handleError
    .pipe rename 'lockstep.js'
    .pipe gulp.dest paths.dist
    .pipe rename 'lockstep.min.js'
    .pipe uglify()
    .on 'error', handleError
    .pipe gulp.dest paths.dist
    .pipe gulpIf DEV, browserSync.reload
      stream: true

# compile LESS
gulp.task 'styles', ->
  gulp
    .src "#{paths.example}main.less"
    .pipe less()
    .on 'error', handleError
    .pipe gulp.dest "#{paths.dist}example/"
    .pipe gulpIf DEV, browserSync.reload
      stream: true

# copy HTML
gulp.task 'html', ->
  gulp
    .src "#{paths.example}index.jade"
    .pipe jade()
    .on 'error', handleError
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
