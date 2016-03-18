var gulp = require('gulp');
var debug = require('gulp-debug');
var uglify  = require("gulp-uglify");
var gutil = require('gulp-util');
var minifyCss = require('gulp-minify-css');
var gulpsync = require('gulp-sync')(gulp);
var folders = ['font', 'img', 'uploads', 'view','plugins'];
var merge = require("merge-stream");
var del = require('del');

gulp.task("clean", function(){ // 清理文件
    return del(["statics/test/**/*", "!statics/test/img", "!statics/test/img/*"])
});

gulp.task('copy', function(){ // 复制静态资源
    var tasks = folders.map(function(value){
        return gulp.src('public/' + value + "/**/*.*")
            .pipe(debug({title: 'gulp-debug:'}))
            .pipe(gulp.dest('statics/' + value));
    });

    return merge(tasks);
});

gulp.task('js', function () {// 压缩JS
    gulp.src(['public/js/**/*.js','public/js/**/*.min.js'])
        .pipe(debug({title: 'gulp-debug:'}))
        .pipe(uglify().on('error', gutil.log)) // notice the error event here
        .pipe(gulp.dest('statics/js'))
});

gulp.task('plugins-js', function () {// 压缩插件JS
    gulp.src(['public/plugins/**/*.js', '!public/plugins/**/*.min.js'])
        .pipe(debug({title: 'gulp-debug:'}))
        .pipe(uglify().on('error', gutil.log)) // notice the error event here
        .pipe(gulp.dest('statics/plugins'))
});

gulp.task('css', function () {// 压缩css
    gulp.src(['public/css/**/*.css','public/css/**/*.min.css'])
        .pipe(debug({title: 'gulp-debug:'}))
        .pipe(minifyCss().on('error', gutil.log)) // notice the error event here
        .pipe(gulp.dest('statics/css'))
});

gulp.task('plugins-css',  function () {// 压缩插件css
    gulp.src(['public/plugins/**/*.css','public/plugins/**/*.min.css'])
        .pipe(debug({title: 'gulp-debug:'}))
        .pipe(minifyCss().on('error', gutil.log)) // notice the error event here
        .pipe(gulp.dest('statics/plugins'))
});

gulp.task('generate', gulpsync.sync(['clean', 'copy', 'js', 'plugins-js', 'css' , 'plugins-css']));
gulp.task('default', ['js', 'css']);