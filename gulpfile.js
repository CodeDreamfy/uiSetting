const gulp = require('gulp');
const del = require('del');
const csswring = require('csswring');
const cssmqpacker = require('css-mqpacker');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
//postcss
const postcss = require('postcss');
const _import = require('postcss-import');
const autoprefixer = require("autoprefixer");
const nested = require("postcss-nested");
const cssnext = require('postcss-cssnext');

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const $ = require('gulp-load-plugins')({
  rename: {
    'gulp-postcss': '_postcss',
    'gulp-babel': 'babel',
    'gulp-clean-css': 'cleancss',
    'gulp-concat': 'concat',
    'gulp-imagemin': 'imagemin',
    'gulp-rename': 'rename',
    'gulp-uglify': 'uglify',
    'gulp-sourcemaps': 'sourcemaps',
    'gulp-notify': 'notify',
    'gulp-changed-in-place': 'changePlace',
    'gulp-debug': 'debug',
    'gulp-streamify': 'streamify',
    'gulp-browserify': 'browserify'
  }
}); //load gulp-*

gulp.task('borwserSync', ()=>{
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  gulp.watch('./src/css/**/*.css', ['postcss'])
  gulp.watch('./src/js/**/*.js', ['browserify'])
  gulp.watch('./dest/*').on('change', reload)
})

gulp.task('clean:js', ()=>{
  return del('./dest/js/app.min.js')
})
gulp.task('browserify', ()=>{
  
  return browserify({
          entries: ['./src/js/app.js'],
          debug: true
        })
        .transform('babelify', { presets: ['es2015']})
        .bundle()
        .on('error',errorHandler)
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe($.streamify($.uglify))
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest('./dest/js'))
        .pipe($.debug({title: 'transform：'}))
        .pipe(reload({stream: true}));

})
gulp.task('clean:css', ()=>{
  return del('./dest/css/main.min.js')
})
gulp.task('postcss', ()=>{
  let progresses = [
    _import,
    cssnext({
      features:{
        rem: false
      }
    }),
    cssmqpacker
  ];
  
  return gulp.src('./src/css/**/*.css')
    .pipe($.concat('main.css'))
    .pipe($.changePlace())
    .pipe($.debug({title: 'transform：'}))
    .pipe($._postcss(progresses))
    .on('error', errorHandler)
    .pipe($.cleancss())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('./dest/css'))
    .pipe(reload({stream: true}));
})


gulp.task('imgmin', ()=>{
  return gulp.src('./images/**/*')
    .pipe($.imagemin())
    .pipe(gulp.dest('./images'))
})



gulp.task('default', ['postcss','browserify','borwserSync']);


function errorHandler(error) {
  console.log(error.message);
  console.log(error.fileName);
  console.log('line:', error.line, 'column:', error.column);
  this.emit('end');
}