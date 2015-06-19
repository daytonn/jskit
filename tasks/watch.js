var gulp = require("gulp");

gulp.task("watch", ["build"], function() {
  gulp.watch("documentation-theme/scss/**/*.scss", ["styles"]);
  gulp.watch("src/**/*", ["build"]);
});
