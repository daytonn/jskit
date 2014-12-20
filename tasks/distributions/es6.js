var gulp = require("gulp");

gulp.task("es6", function() {
  return  gulp.src(["lib/**/*.js"])
    .pipe(gulp.dest("dist/es6"));
});
