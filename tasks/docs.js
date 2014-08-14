var exec = require('child_process').exec;
var gulp = require('gulp');
var util = require('gulp-util');

gulp.task('docs', function() {
  exec('yuidoc -t yuidoc-theme -o documentation lib', function(err, stdout, stderr) {
    util.log('Documentation built at ./documentation/index.html');
  });
});
