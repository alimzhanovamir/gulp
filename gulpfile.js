var gulp						= require('gulp'),
		sass						= require('gulp-sass'),
		combinemq				= require('gulp-combine-mq'),
		browserSync			= require('browser-sync'),
		autopref				= require('gulp-autoprefixer'),
		nunjuksRender   = require('gulp-nunjucks-render');

// Task SASS
gulp.task('sass', function(){
	return gulp.src('src/sass/*.sass')
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	.pipe(autopref(['last 20 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
	.pipe(combinemq())
	.pipe(gulp.dest('src/css'))
	.pipe(browserSync.reload({stream:true}))
});

// Task BROWSER-SYNC
gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'src'
		},
		notify: false
	})
});

// Task Nunjuks
gulp.task('nunjucks', function() {
	return gulp.src('src/njk/*.+(html|njk)')
		.pipe(nunjuksRender({
			path: 'src/njk/'
		}))
		.pipe(gulp.dest('src'));
});

// Task WATCH
gulp.task('watch', ['nunjucks', 'browser-sync', 'sass'], function(){
	gulp.watch('src/**/*.+(html|njk)', ['nunjucks'])
	gulp.watch('src/sass/*.sass', ['sass']);
	gulp.watch('src/**/*.+(html|njk)', browserSync.reload);
	gulp.watch('src/**/*.js', browserSync.reload);
});