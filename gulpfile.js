var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	livereload = require('gulp-livereload'),
	imagemin = require('gulp-imagemin'),
//	sprite_smith = require('gulp.spritesmith'),
	svgstore = require('gulp-svgstore'),
//	replace = require('gulp-replace'),
//	concat = require('gulp-concat'),
//	uglify = require('gulp-uglify'),
//	html_replace = require('gulp-html-replace'),
	gulpFilter = require('gulp-filter' );
//	gulpsync = require('gulp-sync')(gulp);


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
	var map_filter = gulpFilter( [ '*', '!*.map' ] );
	return gulp.src( 'src/sass/**/*', { base: 'src/sass' } )
		.pipe( plumber( plumber_config ) )
		.pipe( sass( {
			'style': 'compressed'
		} ) )
		.pipe( map_filter )
		.pipe( autoprefixer() )
		.pipe( gulp.dest( 'dist/css' ) );
});
gulp.task( 'sass_watch', function(){
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
		.pipe( gulp.dest( 'dist/images' ) );
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
		.pipe( svgstore( {
			fileName: 'svg_sprite.svg',
			prefix: 'icon-'
		} ) )
		.pipe( gulp.dest( 'dist/images' ) );
} );
gulp.task( 'svg_sprite_watch', function(){
	gulp.watch( 'src/svg_sprite/**/*', [ 'svg_sprite' ] );
} );


/*
HTML process
 */
//gulp.task( 'html', function() {
//	return gulp.src( 'src/index.html' )
//		.pipe( plumber( plumber_config ) )
//		.pipe( html_replace( {
//			layout: 'css/layout.css',
//			js: 'js/scripts.js'
//		} ) )
//		.pipe( replace( '../dist/images/svg_sprite.svg', 'images/svg_sprite.svg' ) )
//		.pipe( gulp.dest( 'dist' ) );
//} );


/*
JS compile
 */
//gulp.task( 'js', function() {
//	var html = require( 'fs' ).readFileSync( './src/index.html', { encoding: 'utf-8' } );
//	var scripts_re = /<!-- build:js -->([\s\S]*?)<!-- endbuild -->/g;
//	var scripts = scripts_re.exec( html );
//	scripts = scripts[1];
//
//	var src_re = /src="(.+?)"/g;
//	var src = [];
//	while( one = src_re.exec( scripts ) ) {
//		src.push( 'src/' + one[1] );
//	}
//
//	return gulp.src( src )
//		.pipe( plumber( plumber_config ) )
//		.pipe( concat( 'scripts.js' ) )
//		.pipe( uglify() )
//		.pipe( gulp.dest( 'dist/js' ) );
//} );


/*
Livereload
 */
gulp.task( 'livereload', function(){
	livereload.listen();
	gulp.watch( [ 'dist/**/*', 'src/*.html', 'src/js/**/*' ], function( e ){
		livereload.changed( e.path );
	} );
} );


/*
Tasks
 */
gulp.task( 'default', [ 'sass', 'images', 'svg_sprite' ] );
gulp.task( 'dev', [ 'sass_watch', 'livereload', 'images_watch', 'svg_sprite_watch' ] );