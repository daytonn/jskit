var gulp = require("gulp");
var util = require("gulp-util");
var traceur = require("gulp-traceur");
var browserify = require("gulp-browserify");

gulp.task("transpile", ["clean"], function () {
  return gulp.src([
    "lib/*.js"
  ])
    .pipe(traceur({ modules: "commonjs" }).on("error", util.log))
    .pipe(gulp.dest("tmp/transpiled"));
});

gulp.task("browserify", ["transpile"], function() {
  return gulp.src(["tmp/transpiled/jskit.js"])
    .pipe(browserify({ insertGlobals: true }).on("error", util.log))
    .pipe(gulp.dest("tmp/compiled"));
});
