var gulp = require('gulp');
var uglify  = require("gulp-uglify");
var gutil = require('gulp-util');
var minifyCss = require('gulp-minify-css');
var gulpsync = require('gulp-sync')(gulp);
var folders = ['font', 'img', 'uploads', 'view'];
var merge = require("merge-stream");

gulp.task('copy', function(){
    var tasks = folders.map(function(value){
        return gulp.src('public/' + value + "/**/*.*")
            .pipe(gulp.dest('statics/' + value));
    });

    return merge(tasks);
});

gulp.task('js', function () {
    gulp.src(['public/js/**/*.js','public/js/**/*.min.js'])
        .pipe(uglify().on('error', gutil.log)) // notice the error event here
        .pipe(gulp.dest('statics/js'))
});

gulp.task('plugins-js', function () {
    gulp.src(['public/plugins/**/*.js', '!public/plugins/**/*.min.js'])
        .pipe(uglify().on('error', gutil.log)) // notice the error event here
        .pipe(gulp.dest('statics/plugins'))
});

gulp.task('css', function () {
    gulp.src(['public/css/**/*.css','public/css/**/*.min.css'])
        .pipe(minifyCss().on('error', gutil.log)) // notice the error event here
        .pipe(gulp.dest('statics/css'))
});

gulp.task('plugins-css',  function () {
    gulp.src(['public/plugins/**/*.css','public/plugins/**/*.min.css'])
        .pipe(minifyCss().on('error', gutil.log)) // notice the error event here
        .pipe(gulp.dest('statics/plugins'))
});

gulp.task('default', gulpsync.sync(['copy', 'js', 'plugins-js', 'css' , 'plugins-css']));