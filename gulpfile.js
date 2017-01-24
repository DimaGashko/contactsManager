'use strict'

var gulp = require('gulp');

var minifyCss = require('gulp-minify-css');
var prefix = require('gulp-autoprefixer');
var sass = require('gulp-sass');

var uglify = require('gulp-uglify');
var babel = require('gulp-babel');

var rename = require('gulp-rename');
var notify = require('gulp-notify');
var gulpif = require('gulp-if');

var useref = require('gulp-useref');

var imagemin = require('gulp-imagemin');

var wiredep = require('wiredep').stream;

gulp.task('default', ['css']);
 
//css
gulp.task('css', function () {
	return gulp.src('app/scss/main.scss')
		.pipe(sass())
		.pipe(prefix("last 100 versions"))
		.pipe(rename("app/css/main.css"))
		.pipe(gulp.dest(''))
		.pipe(notify());
});

//bower
gulp.task('bower', function() {
	gulp.src("app/index.html")
		.pipe(wiredep({
			directory: "app/bower_components",
			fileTypes: { 
				html: {
					replace: {
						"js": '<script defer src="{{filePath}}"></script>',
					}
				},
			}
		}))
		.pipe(gulp.dest('app'));
});

//build
gulp.task('html', ['html', 'img']);

gulp.task('html', function() {
	return gulp.src('app/*html')
		.pipe(useref())
		.pipe(gulpif('*.js', 
			uglify(), babel({presets: ['es2015']})
		))
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(gulp.dest('dist'));
});

gulp.task('img', function() {
   return gulp.src('app/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'));
});

gulp.task('watch:css', function() {
	return gulp.watch('app/scss/**/*.scss', ['css']);
});
/*

.pipe(*/