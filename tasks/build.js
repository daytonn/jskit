var gulp = require("gulp");
var browserify = require("gulp-browserify");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var rename = require("gulp-rename");

gulp.task('compile', function() {
  return gulp.src("lib/jskit.js")
    .pipe(browserify({ insertGlobals: true }))
    .pipe(gulp.dest("dist")
    .pipe(gulp.dest("example")));
});

gulp.task('minify', ['compile'], function() {
  return gulp.src("dist/jskit.js")
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist"));
});

gulp.task("build", ["minify"]);
