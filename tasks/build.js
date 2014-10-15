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

gulp.task("transpile", ["clean"], function () {
  return gulp.src([
    "lib/**/*.js"
  ])
    .pipe(traceur({ modules: "commonjs" }).on("error", util.log))
    .pipe(gulp.dest("tmp/transpiled"));
});

gulp.task("compile", ["transpile"], function() {
  return gulp.src(["tmp/transpiled/jskit.js"])
    .pipe(browserify({ insertGlobals: true }).on("error", util.log))
    .pipe(gulp.dest("tmp/compiled"));
});

gulp.task("concat", ["compile"], function() {
  return gulp.src([
    "node_modules/traceur/bin/traceur-runtime.js",
    "tmp/compiled/**/*.js",
    ])
    .pipe(concat("jskit.js"))
    .pipe(gulp.dest("dist"));
});

gulp.task("minify", ["concat"], function() {
  return gulp.src("dist/jskit.js")
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist"));
});

gulp.task("example", ["minify"], function() {
  gulp.src(["dist/jskit.js"])
    .pipe(gulp.dest("example"));
});

gulp.task("build", ["example"], function() {
  return gulp.src(["tmp"])
    .pipe(clean());
});
