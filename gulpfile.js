var gulp       	 = require('gulp'), 
		sass         = require('gulp-sass'), 
		browserSync  = require('browser-sync'), 
		concat       = require('gulp-concat'), 
		uglify       = require('gulp-uglifyjs'), 
		cssnano      = require('gulp-cssnano'), 
		rename       = require('gulp-rename'), 
		del          = require('del'), 
		imagemin     = require('gulp-imagemin'), 
		pngquant     = require('imagemin-pngquant'), 
		cache        = require('gulp-cache'), 
		autoprefixer = require('gulp-autoprefixer'),
		cssbeautify  = require('gulp-cssbeautify'),
		rigger  = require('gulp-rigger');


// Styles
gulp.task('styles', function() { 
	return gulp.src('src/sass/style.sass') 
		.pipe(sass()) 
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
		.pipe(cssbeautify({
      indent: '  '
    }))
		.pipe(gulp.dest('build/css')) 
		.pipe(browserSync.reload({stream: true})) 
});

gulp.task('styles:libs', function() {
	return gulp.src([
	'src/libs/normalize/normalize.css',
	'src/libs/bootstrap-grid/bootstrap-grid.min.css',
	'src/libs/fancybox/jquery.fancybox.min.css',
	'src/libs/swiper/swiper.min.css'
	]) 
		.pipe(concat('libs.min.css')) 
		.pipe(cssnano()) 
		.pipe(gulp.dest('build/css')); 
});


// Server
gulp.task('browser-sync', function() { 
	browserSync({ 
		server: { 
			baseDir: 'build' 
		},
		notify: false 
	});
});


// Scripts
gulp.task('scripts', function() {
	return gulp.src('src/js/common.js')
		.pipe(rigger())
		.pipe(gulp.dest('build/js')); 
});

gulp.task('scripts:libs', function() {
	return gulp.src([ 
		'src/libs/jquery/dist/jquery.min.js', 
		'src/libs/fancybox/jquery.fancybox.min.js',
		'src/libs/swiper/swiper.min.js' 
	])
		.pipe(concat('libs.min.js')) 
		.pipe(uglify()) 
		.pipe(gulp.dest('build/js')); 
});


// HTML
gulp.task('html', function() {
	return gulp.src('src/*.html')
		.pipe(rigger())
		.pipe(gulp.dest('build'))
		.pipe(browserSync.reload({ stream: true }));
});


// Clean
gulp.task('clean', async function() {
	return del.sync('build'); 
});


// Images
gulp.task('img', function() {
	return gulp.src('src/img/**/*') 
		.pipe(cache(imagemin({ 
		
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))/**/)
		.pipe(gulp.dest('build/img')); 
});


// Copy
gulp.task('copy', function() {
	return gulp.src('src/assets/**/*')
		.pipe(gulp.dest('build'));
});


//Clear
gulp.task('clear', function (callback) {
	return cache.clearAll();
});


// Watch
gulp.task('watch', function() {
	gulp.watch(['src/sass/**/*.sass', 'src/blocks/**/*.sass'], gulp.parallel('styles')); 
	gulp.watch('src/**/*.html', gulp.parallel('html')); 
	gulp.watch(['src/js/common.js', 'src/libs/**/*.js'], gulp.parallel('scripts')); 
	gulp.watch('src/img/**/*', gulp.parallel('img')); 
});
gulp.task('default', gulp.parallel('clean', 'html', 'copy', 'styles:libs', 'styles', 'scripts:libs', 'scripts', 'img', 'browser-sync', 'watch'));
