var gulp = require("gulp");
var docco = require("gulp-docco");

gulp.task("docs", function() {
  return gulp.src("./src/*.js")
    .pipe(docco())
    .pipe(gulp.dest('./documentation'))
});
