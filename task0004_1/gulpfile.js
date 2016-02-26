var gulp = require('gulp');

// gulp.task('default', function () {
//     // console.log('gulp run'); 
// });

var less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    // jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    // rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    // concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache');
    // livereload = require('gulp-livereload');

gulp.task('styles', function() {
    return gulp.src('src/less/style.less')
        .pipe(less())
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('src/css/'))
        .pipe(minifycss())
        .pipe(gulp.dest('public/css'))
        .pipe(notify({
            message: 'Styles task complete'
        }));
});

gulp.task('scripts', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('public/js'))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});

gulp.task('images', function() {
    return gulp.src('src/img/**')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('public/img'))
        .pipe(notify({
            message: 'Images task complete'
        }));
});

gulp.task('default', function() { 
    gulp.start('styles', 'scripts', 'images');
});

gulp.task('watch', function () {
    gulp.watch('src/less/style.less', ['styles']);

    gulp.watch('src/js/**/*.js', ['scripts']);
});