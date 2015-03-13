/* global jQuery */
( function( $ ){

	$( function() {

		var header = $( '[data-js-main_header]' );
		var duration = 300;
		var button = $( '[data-js-menu_button]' ).on( 'click', function() {

			if( header.hasClass( 'is-open' ) ) {
				//close
				var complete_fnc = function( el ){
					$( el ).attr( 'style', '' );
				};
				header.removeClass( 'is-open' ).velocity( 'stop' ).velocity( 'fadeOut', { duration: duration, complete: complete_fnc } );
				button.removeClass( 'is-active' );
			} else {
				//open
				header.addClass( 'is-open' ).velocity( 'stop' ).velocity( 'fadeIn', { duration: duration, display: 'flex' } );
				button.addClass( 'is-active' );
			}

		} );

	} );

} )( jQuery );