'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';

gulp.task('watch', () => {
    return gulp.watch('./src/**/*', ['js']);
});


gulp.task('backend', () => {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015'],
            plugins: ['transform-runtime',
                      'transform-regenerator',
                      'syntax-async-functions']
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('default', ['backend', 'watch']);
