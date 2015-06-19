var gulp = require("gulp");
var exec = require("gulp-exec");

gulp.task("docs", function() {
  return gulp.src("./**/**")
    .pipe(exec("npm run docs"));
});
