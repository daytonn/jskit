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

gulp.task("concat_without_traceur", ["compile"], function() {
  return gulp.src([
    "tmp/compiled/**/*.js",
    ])
    .pipe(concat("jskit_standalone.js"))
    .pipe(gulp.dest("dist"));
});

gulp.task("concat_with_traceur", ["concat_without_traceur"], function() {
  return gulp.src([
    "node_modules/traceur/bin/traceur-runtime.js",
    "tmp/compiled/**/*.js",
    ])
    .pipe(concat("jskit.js"))
    .pipe(gulp.dest("dist"));
});

gulp.task("minify", ["concat_with_traceur"], function() {
  return gulp.src("dist/jskit.js")
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist"));
});

gulp.task("es6", ["example"], function() {
  return  gulp.src(["lib/**/*.js"])
    .pipe(gulp.dest("dist/es6"));
});

gulp.task("example", ["minify"], function() {
  gulp.src(["dist/jskit.js"])
    .pipe(gulp.dest("example"));
});

gulp.task("build", ["es6"], function() {
  return gulp.src(["tmp"])
    .pipe(clean());
});
