'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('buildSass', function () {
  gulp.src('./css/dashboard.scss')
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./css'));
  gulp.src('./css/login.scss')
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});