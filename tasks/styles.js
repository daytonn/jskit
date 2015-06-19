var gulp = require("gulp");
var sass = require("gulp-sass");

gulp.task("styles", function () {
  gulp.src("documentation-theme/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("documentation-theme/assets/css"));
});
