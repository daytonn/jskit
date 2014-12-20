var gulp = require("gulp");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");

gulp.task("concat_without_traceur", ["browserify"], function() {
  return gulp.src([
    "tmp/compiled/**/*.js",
    ])
    .pipe(concat("jskit_standalone.js"))
    .pipe(gulp.dest("dist"));
});

gulp.task("minify_without_traceur", ["concat_without_traceur"], function() {
  return gulp.src([
    "dist/jskit_standalone.js",
    ])
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist"));
});

gulp.task("standalone", ["minify_without_traceur"]);
