var browserify = require("gulp-browserify");
var clean = require("gulp-clean");
var concat = require("gulp-concat");
var filter = require("gulp-filter");
var gulp = require("gulp");
var rename = require("gulp-rename");
var traceur = require("gulp-traceur");
var uglify = require("gulp-uglify");
var util = require("gulp-util");
var wrap = require("gulp-wrap");

gulp.task("clean-specs", function() {
  return gulp.src(["spec/tmp"])
    .pipe(clean());
});

gulp.task("transpile-specs", ["clean-specs"], function () {
  return gulp.src([
    "lib/**/*.js",
    "spec/**/*.js"
  ])
    .pipe(traceur({ modules: "commonjs" }).on("error", util.log))
    .pipe(gulp.dest("spec/tmp/transpiled"));
});

gulp.task("compile-specs", ["transpile-specs"], function() {
  return gulp.src(["spec/tmp/transpiled/**/*.js"])
    .pipe(browserify({ insertGlobals: true }).on("error", util.log))
    .pipe(concat("jskit_spec.js"))
    .pipe(gulp.dest("spec/compiled"));
});

gulp.task("spec", ["compile-specs"], function() {
  return gulp.src(["spec/tmp"])
    .pipe(clean());
});
