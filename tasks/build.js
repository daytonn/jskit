var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");

gulp.task("build", function () {
  return gulp.src("src/jskit.js")
    .pipe(sourcemaps.init())
    .pipe(concat("jskit.js"))
    .pipe(babel())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"));
});
// var gulp = require("gulp");
// var concat = require("gulp-concat");
// var rename = require("gulp-rename");
// var uglify = require("gulp-uglify");

// gulp.task("concat", function() {
//   return gulp.src([
//     "lib/namespace.js",
//     "lib/dispatcher.js",
//     "lib/test_dispatcher.js",
//     "lib/controller.js",
//     "lib/application.js",
//     "lib/api.js"
//   ])
//     .pipe(concat("jskit.js"))
//     .pipe(gulp.dest("dist"));
// });

// gulp.task("minify", ["concat"], function() {
//   return gulp.src("dist/jskit.js")
//     .pipe(uglify())
//     .pipe(rename({ suffix: ".min" }))
//     .pipe(gulp.dest("dist"));
// });

// gulp.task("example", ["minify"], function() {
//   return gulp.src(["dist/jskit.js", "node_modules/lodash/lodash.js"])
//     .pipe(gulp.dest("example"));
// });

// gulp.task("build", ["example"]);
