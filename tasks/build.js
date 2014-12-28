var clean = require("gulp-clean");
var gulp = require("gulp");
var requireDir = require("require-dir");
var dir = requireDir("./distributions");

gulp.task("build", ["main", "standalone", "es6", "legacy", "example"], function() {
  return gulp.src("tmp")
    .pipe(clean());
});
