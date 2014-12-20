var concat = require("gulp-concat");
var gulp = require("gulp");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");

gulp.task("concat_with_traceur", ["browserify"], function() {
  return gulp.src([
    "node_modules/traceur/bin/traceur-runtime.js",
    "tmp/compiled/**/*.js",
    ])
    .pipe(concat("jskit.js"))
    .pipe(gulp.dest("dist"));
});

gulp.task("minify_with_traceur", ["concat_with_traceur"], function() {
  return gulp.src("dist/jskit.js")
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist"));
});

gulp.task("main", ["minify_with_traceur"]);
