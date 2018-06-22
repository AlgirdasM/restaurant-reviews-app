/*eslint-env node */

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');

// default action, development mode
gulp.task('default', ['lint'], function() {
  gulp.watch('./src/js/*.js', ['lint']).on('change', browserSync.reload);
  gulp.watch('./src/*.js', ['lint']).on('change', browserSync.reload);
  gulp.watch('./src/*.html').on('change', browserSync.reload);
  gulp.watch('./src/css/*.css').on('change', browserSync.reload);

  browserSync.init({
    server: './src',
    port: 8000
  });

});

// make and serve distribution app
gulp.task('serve', ['lint', 'copy-html', 'copy-js', 'copy-images', 'copy-data', 'copy-pwa', 'styles'], function() {
  gulp.watch('./src/js/*.js', ['lint']).on('change', browserSync.reload);
  gulp.watch('./src/*.js', ['lint']).on('change', browserSync.reload);
  gulp.watch('./src/*.html').on('change', browserSync.reload);
  gulp.watch('./src/css/*.css').on('change', browserSync.reload);

  browserSync.init({
    server: './dist',
    port: 8000
  });

});

gulp.task('lint', function() {
  return gulp.src(['src/js/*.js'])
    // eslint() attaches the lint output to the eslint property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failOnError last.
    .pipe(eslint.failOnError());
});

// Copy all html to dist
gulp.task('copy-html', function() {
  gulp.src('./src/*.html')
    .pipe(gulp.dest('./dist'));
});

// Copy all js to dist
gulp.task('copy-js', function() {
  gulp.src('./src/js/**/*.js')
    .pipe(gulp.dest('./dist/js'));
});

// Copy all js to dist
gulp.task('copy-images', function() {
  gulp.src('./src/img/*')
    .pipe(gulp.dest('./dist/img'));
});

// Copy restaurant data to dist
gulp.task('copy-data', function() {
  gulp.src('./src/data/*')
    .pipe(gulp.dest('./dist/data'));
});

// Copy service worker and other pwa
gulp.task('copy-pwa', function() {
  gulp.src('./src/sw.js')
    .pipe(gulp.dest('./dist'));
});

// Copy css and add prefixes
gulp.task('styles', function() {
  gulp.src('./src/css/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});