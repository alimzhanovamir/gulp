var gulp				= require('gulp'),
		sass				= require('gulp-sass'),
		combinemq		= require('gulp-combine-mq'),
		browserSync	= require('browser-sync'),
		autopref		= require('gulp-autoprefixer');

// Task SASS
gulp.task('sass', function(){
	return gulp.src('app/sass/*.sass')
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	.pipe(autopref(['last 20 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
	.pipe(combinemq())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream:true}))
});

// Task BROWSER-SYNC
gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir:'app'
		},
		notify:false
	})
});

// Task WATCH
gulp.task('watch', ['browser-sync', 'sass'], function(){
	gulp.watch('app/sass/*.sass', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/**/*.js', browserSync.reload);
});