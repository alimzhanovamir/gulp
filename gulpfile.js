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

// gulp.task('iconfont', function(){
//   gulp.src(['src/img/svg/*.svg'])
//      .pipe(iconfontCss({
//         path: 'src/sass/_icon_template.scss',
//         fontName: 'fa',
//         targetPath: '../../sass/_icons.scss',
//         fontPath: 'src/fonts/icons/'
//      }))
//      .pipe(iconfont({
// 				fontName: 'fa',
// 				formats: ['ttf', 'woff', 'woff2'],
//      }))
//      .pipe(gulp.dest('src/fonts/icons/'));
// });

// Task SVG-SPRITE
gulp.task('svg', function () {
	return gulp.src('src/img/svg/*.svg')
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: '../sprite.svg',
					render: {
						scss: {
							dest:'../../../sass/_sprite.scss',
							template: 'src/sass/_sprite-template.scss'
						}
					}
				}
			}
		}))
		.pipe(gulp.dest('src/img/sprite/'));
});

// Task HTML-PRETTIFY
gulp.task('html', function() {
  gulp.src('src/*.html')
    .pipe(prettify({indent_char: '	', indent_size: 1}))
    .pipe(gulp.dest('src'))
});

// Task WATCH
gulp.task('watch', ['nunjucks', 'browser-sync', 'sass'], function(){
	gulp.watch('src/**/*.+(html|njk)', ['nunjucks'])
	gulp.watch('src/sass/*.sass', ['sass']);
	gulp.watch('src/**/*.+(html|njk)', browserSync.reload);
	gulp.watch('src/**/*.js', browserSync.reload);
});