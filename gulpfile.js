var requireDir = require("require-dir");
var dir = requireDir("./tasks");
var gulp = require("gulp");

gulp.task("default", ["build", "watch", "styles"]);
