/*
 * gulp -> production
 * gulp dev -> watcher
 */

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	livereload = require('gulp-livereload'),
	imagemin = require('gulp-imagemin'),
//	sprite_smith = require('gulp.spritesmith'),
	svgstore = require('gulp-svgstore'),
	rename = require('gulp-rename'),
//	replace = require('gulp-replace'),
//	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
//	html_replace = require('gulp-html-replace'),
	gulpFilter = require('gulp-filter' );
//	gulpsync = require('gulp-sync')(gulp);
var yargs = require('yargs').argv;
var gulpif = require('gulp-if');
var browsersync = require('browser-sync').create();

var dev = ( yargs._[0] === 'dev' ) ? true : false;

var plumber_config = {
	errorHandler: function (err) {
		console.log(err.toString());
		this.emit('end');
	}
};

/*
Bitmap sprite
 */
//gulp.task( 'bitmap_sprite', function(){
//	var sprite = gulp.src( 'src/bitmap_sprite/*.png' )
//		.pipe( plumber( plumber_config ) )
//		.pipe( imagemin() )
//		.pipe( sprite_smith( {
//			imgName: 'sprite.png',
//			cssName: '_bitmap_sprite.scss',
//			imgPath: '../images/sprite.png'
//		} ) );
//
//	sprite.css.pipe( gulp.dest( 'src/sass' ) );
//	sprite.img.pipe( gulp.dest( 'dist/images' ) );
//
//	return sprite;
//} );
//gulp.task( 'watch_bitmap_sprite', function(){
//	gulp.watch( 'src/bitmap_sprite/**/*', [ 'bitmap_sprite' ] );
//} );

/*
SASS
 */
gulp.task( 'sass', function(){

	return gulp.src( 'src/sass/**/*.scss', { base: 'src/sass' } )
		.pipe( plumber( plumber_config ) )
		.pipe( gulpif( dev, sass( {
			outputStyle: 'expanded'
		} ), sass( {
			outputStyle: 'compressed'
		} ) ) )
		.pipe( autoprefixer() )
		.pipe( gulp.dest( 'dist/css' ) )
		.pipe( gulp.dest( '../wp/wp-content/themes/linnette/assets/css' ) )
		.pipe( browsersync.stream() );

});
gulp.task( 'sass_watch', ['sass'], function(){
	gulp.watch( 'src/sass/**/*.scss', [ 'sass' ] );
} );


/*
Images
 */
gulp.task( 'images', function(){
	return gulp.src( 'src/images/**/*', { base: 'src/images' } )
		.pipe( plumber( plumber_config ) )
		.pipe( imagemin( {
			progressive: true
		} ) )
		.pipe( gulp.dest( 'dist/images' ) )
		.pipe( gulp.dest( '../wp/wp-content/themes/linnette/assets/images' ) );
} );
gulp.task( 'images_watch', function(){
	gulp.watch( 'src/images/**/*', [ 'images' ] );
} );

/*
SVG Sprite
 */
gulp.task( 'svg_sprite', function(){
	gulp.src( 'src/svg_sprite/**/*.svg' )
		.pipe( plumber( plumber_config ) )
		.pipe( imagemin() )
		.pipe( rename( { prefix: 'icon-' } ) )
		.pipe( svgstore( {
			fileName: 'svg_sprite.svg'
		} ) )
		.pipe( gulp.dest( 'dist/images' ) )
		.pipe( gulp.dest( '../wp/wp-content/themes/linnette/assets/images' ) );
} );
gulp.task( 'svg_sprite_watch', function(){
	gulp.watch( 'src/svg_sprite/**/*', [ 'svg_sprite' ] );
} );



/*
JS compile
 */
gulp.task( 'js', function() {
	return gulp.src( 'src/js/**/*.js', { base: 'src/js' } )
		.pipe( plumber( plumber_config ) )
		.pipe( uglify() )
		.pipe( gulp.dest( 'dist/js' ) )
		.pipe( gulp.dest( '../wp/wp-content/themes/linnette/assets/js' ) );
} );


/*
DEV
 */
gulp.task( 'browsersync', function() {

	browsersync.init( {
		server: "./",
		directory: true
	} );

	gulp.watch( 'src/*.html' ).on('change', browsersync.reload);

} );


/*
Tasks
 */
gulp.task( 'default', [ 'sass', 'images', 'svg_sprite', 'js' ] );
gulp.task( 'dev', [ 'sass_watch', 'browsersync', 'images_watch', 'svg_sprite_watch' ] );