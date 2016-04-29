/* global jQuery, textFit, enquire */
( function( $, textFit, enquire ){

	var ImageWithText = {

		init: function( el ) {
			this.el = el;
			this.timeout = null;
			this.time_to_get_it_done = 200; //Should be enough to get all fitting done, sorry for performance-dependend code :(
			this.maxsize = ( typeof el.data( 'js-fittext-maxsize' ) !== 'undefined' ) ? el.data( 'js-fittext-maxsize' ) : 22;
			this.dontfitbelow = ( typeof el.data( 'js-fittext-dontfitbelow' ) !== 'undefined' ) ? el.data( 'js-fittext-dontfitbelow' ) : 800;
			this.is_below = false;

			this.window = $( window ); //cache

			//Bind events:
			this.maybe_fit();
			this.window.load( $.proxy( this.maybe_fit, this ) );
			this.window.resize( $.proxy( this.maybe_fit, this ) );

			var t = this;
			enquire.register( 'only screen and ( max-width: ' + this.dontfitbelow + 'px )', {
				match: function() { t.is_below = true; $.proxy( t.maybe_fit, t ); },
				unmatch: function() { t.is_below = false; $.proxy( t.maybe_fit, t ); }
			} );
		},

		maybe_fit: function() {
			var t = this;

			//Dont fit below some breakpoint
			if( this.is_below ) {
				//Reset styles and bail
				clearTimeout( this.timeout );
				this.el.find('.textFitted').css( 'font-size', '' );
				return;
			}

			//We will overwrite all previous running fitting
			clearTimeout( this.timeout );
			this.timeout = setTimeout( function() {

				textFit( t.el, {
					maxFontSize: t.maxsize
				} );

			}, this.time_to_get_it_done );

		}

	};

	//Init
	$( function() {
		$( '[data-js-fittext]' ).each( function(){
			Object.create( ImageWithText ).init( $( this ) );
		} );
	} );

} )( jQuery, textFit, enquire );
