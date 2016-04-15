/* global jQuery, textFit */
( function( $, textFit ){

	var ImageWithText = {

		init: function( el ) {
			this.el = el;
			this.fitting = false;
			this.timeout = null;
			this.time_to_get_it_done = 200; //Should be enough to get all fitting done, sorry for performance-dependend code :(

			//Bind events:
			this.maybe_fit();
			$( window ).load( $.proxy( this.maybe_fit, this ) );
			$( window ).resize( $.proxy( this.maybe_fit, this ) );
		},

		maybe_fit: function() {
			var t = this;

			//We will overwrite all previous running fitting
			clearTimeout( this.timeout );
			this.timeout = setTimeout( function() {

				t.el.find('.textFitted').css( 'font-size', '1px' );//TODO: dont really work, still fitting to small for some width
				textFit( t.el );

			}, this.time_to_get_it_done );

		}

	};

	//Init
	$( function() {
		$( '.image_with_text__text' ).each( function(){
			Object.create( ImageWithText ).init( $( this ) );
		} );
	} );

} )( jQuery, textFit );
