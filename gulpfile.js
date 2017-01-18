const gulp = require('gulp');
const del = require('del');
const csswring = require('csswring');
const cssmqpacker = require('css-mqpacker');
//postcss
const postcss = require('postcss');
const _import = require('postcss-import');
const autoprefixer = require("autoprefixer");
const nested = require("postcss-nested");
const cssnext = require('postcss-cssnext');

const $ = require('gulp-load-plugins')({
  rename: {
    'gulp-postcss': '_postcss',
    'gulp-babel': 'babel',
    'gulp-clean-css': 'cleancss',
    'gulp-concat': 'concat',
    'gulp-imagemin': 'imagemin',
    'gulp-rename': 'rename',
    'gulp-uglify': 'uglify',
    'gulp-sourcemaps': 'sourcemaps'
  }
}); //load gulp-*

gulp.task('clearcss', ()=>{
  return del(['./css/main.min.css'])
})

gulp.task('clearjs', ()=>{
  return del(['./js/main.min.js'])
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
  return gulp.src('./css/main.css')
    .pipe($._postcss(progresses))
    .on('error', errorHandler)
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('./css/'))
})

gulp.task('toes5', ['clearjs'], ()=>{
  return gulp.src('./js/src/**/*.js')
    .pipe($.concat('main.js'))
    .pipe($.babel({
      presets: ['es2015'],
      plugins: ['transform-runtime']
    }))
    .on('error',errorHandler)
    .pipe($.uglify({
      preserveComments: 'license'
    }))
    .on('error',errorHandler)
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('./js/'))

})

gulp.task('imgmin', ()=>{
  return gulp.src('./images/**/*')
    .pipe($.imagemin())
    .pipe(gulp.dest('./images'))
})


gulp.task('watch', ()=>{
  gulp.watch('./css/src/**/*.css', ['postcss'])
  gulp.watch('./js/src/**/*.js', ['toes5'])
})

gulp.task('default', ['watch']);


function errorHandler(error) {
  console.log(error.message);
  console.log(error.fileName);
  console.log('line:', error.line, 'column:', error.column);
  this.emit('end');
}