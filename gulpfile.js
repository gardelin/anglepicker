const gulp = require('gulp')
const sass = require('gulp-sass')
const concat = require('gulp-concat')

const path = {
    src: 'src/',
    dist: 'dist/'
}

gulp.task('sass', function() {
    return gulp
        .src([
            path.src + 'anglepicker.scss',
        ])
        .pipe(sass())
        .pipe(concat('anglepicker.css'))
        .pipe(gulp.dest(path.dist))
});