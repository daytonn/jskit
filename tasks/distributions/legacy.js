var gulp = require("gulp");
var rename = require("gulp-rename");
var browserify = require("gulp-browserify");
var uglify = require("gulp-uglify");

gulp.task("compile_legacy", function() {
  return gulp.src("lib/legacy/jskit.js")
    .pipe(browserify({ insertGlobals: true }))
    .pipe(rename("jskit_legacy.js"))
    .pipe(gulp.dest("dist"));
});

gulp.task("minify_legacy", ["compile_legacy"], function() {
  return gulp.src("dist/jskit_legacy.js")
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist"));
});

gulp.task("legacy", ["minify_legacy"]);
