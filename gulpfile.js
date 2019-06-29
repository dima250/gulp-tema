const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        },
        notify: false
    });
});

gulp.task('html',function () {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream());
});
gulp.task('sass',function () {
    return gulp.src('src/sass/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer({}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream());
});
gulp.task('scripts',function () {
   return gulp.src('src/js/**/*.js')
       .pipe(gulp.dest('build/js'))
       .pipe(browserSync.stream());
});
gulp.task('scripts_libs',function () {
   return gulp.src([
       'src/libs/jquery/dist/jquery.js',
       'src/libs/bootstrap/js/bootstrap.js'
   ])
       .pipe(concat('libs_min.js'))
       .pipe(uglify())
       .pipe(gulp.dest('build/js'))
       .pipe(browserSync.stream());
});
gulp.task('libs',function () {
    return gulp.src('src/libs/**/*')
        .pipe(gulp.dest('build/libs'))
        .pipe(browserSync.stream());


});
gulp.task('fonts',function () {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('build/fonts'))
        .pipe(browserSync.stream());


});
gulp.task('img',function () {
    return gulp.src('src/img/**')
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img'));
});
gulp.task('del',function () {
   return del(['build/*'])
});
gulp.task('watch',function () {
    gulp.watch('src/**/*.html',gulp.series('html'));
    gulp.watch('src/sass/**/*.scss',gulp.series('sass'));
    gulp.watch('src/img/**', gulp.series('img'));
    gulp.watch(['src/libs/**/*.js', 'src/js/**/*.js'], gulp.parallel('scripts'));
});
gulp.task('default',gulp.series('del',
   gulp.parallel('html','sass','scripts','scripts_libs','libs','fonts','img'),
   gulp.parallel('server','watch'),
));
