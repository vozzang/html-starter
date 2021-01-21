const del = require('del');
const gulp = require('gulp');
const sass = require('gulp-sass');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const changed = require ('gulp-changed');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const config = {
  src: './src',
  dist: './dist',
  browserSyncBaseDir: './',
  scss: `./src/assets/scss/**/*.scss`,
  js: `./src/assets/js/**/*.js`,
  jsVendor: [],
  ejs: `./src/templates/**/*.ejs`,
  img: `./src/assets/img/**/*.*`
};

const ejsData = {
  components: {
    button: {
      class: '',
      text: ''
    }
  }
}

const ejsOption = {
}

function clean() {
  return del([config.dist]);
}

function js() {
  return gulp.src(config.js)
    .pipe(gulp.dest(`${config.dist}/assets/js`));
}

function jsVendor() {
  return gulp.src(config.jsVendor, {allowEmpty:true})
  .pipe(gulp.dest(`${config.dist}/assets/js/vendor`));
}

function style() {
  return gulp.src(config.scss)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(`${config.dist}/assets/css`));
}

function html() {
  return gulp.src([
    config.ejs,
    `!${config.src}/templates/@components/**/*.ejs`,
    `!${config.src}/templates/@layouts/**/*.ejs`
  ])
  .pipe(ejs(ejsData, ejsOption))
  .pipe(rename({ extname: '.html' }))
  .pipe(gulp.dest(`${config.dist}`));
}

function img() {
  return gulp.src(config.img)
    .pipe(changed(`${config.dist}/assets/img`))
    .pipe(gulp.dest(`${config.dist}/assets/img`));
}


function watch() {
  gulp.watch(config.js, js).on('change', reload);
  gulp.watch(config.scss, style).on('change', reload);
  gulp.watch(config.ejs, html).on('change', reload);
  gulp.watch(config.img, img).on('change', reload);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: config.browserSyncBaseDir
    }
  });
  watch();
}

const build = gulp.series(clean, gulp.parallel(
  js, jsVendor, style, html, img
));

exports.clean = clean;
exports.js = js;
exports.jsVendor = jsVendor;
exports.style = style;
exports.html = html;
exports.img = img;
exports.watch = watch;
exports.build = build;
exports.serve = serve;
exports.default = build;