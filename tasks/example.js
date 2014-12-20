var gulp = require("gulp");

gulp.task("example", ["main"], function() {
  return gulp.src(["dist/*.js", "node_modules/traceur/bin/traceur-runtime.js"])
      .pipe(gulp.dest("example"));

});
