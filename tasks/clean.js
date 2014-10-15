var clean = require("gulp-clean");
var gulp = require("gulp");

gulp.task("clean", function() {
  return gulp.src(["tmp"])
    .pipe(clean());
});
