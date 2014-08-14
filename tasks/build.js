var gulp = require('gulp');
var browserify = require('gulp-browserify');

gulp.task('build', function() {
  gulp.src('lib/jskit.js')
    .pipe(browserify({ insertGlobals: true }))
    .pipe(gulp.dest('dist'));
});
