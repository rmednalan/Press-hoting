'use strict';

var gulp = require('gulp'),
    flatten = require('gulp-flatten'),
    zip = require('gulp-zip');

gulp.task('build', function() {
    return gulp.src([
        '!./node_modules/**',
        '!./node_modules',
        '!./typings/**',
        '!./typings',
        '!app/**/*.js',
        '!app/**/*.map',
        '!app/**/*.d.ts',
        '**'
    ]).pipe(zip('press.zip'))
        .pipe(gulp.dest('.'));
});