var gulp = require("gulp");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");

gulp.task("concat", function() {
  return gulp.src([
    "src/jskit.js",
    "src/dispatcher.js",
    "src/controller.js",
    "src/application.js"
  ])
    .pipe(concat("jskit.js"))
    .pipe(gulp.dest("dist"));
});

gulp.task("minify", ["concat"], function() {
  return gulp.src("dist/jskit.js")
    .pipe(uglify().on('error', function(error) {
      console.log(error);
    }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist"));
});

gulp.task("build", ["minify"]);
