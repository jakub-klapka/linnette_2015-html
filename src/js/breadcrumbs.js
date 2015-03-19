/* global jQuery */
( function( $ ){

	var Breadcrumbs = {

		init: function( el ) {

			this.el = el.children();

			this.scrollToEnd();
			$( document ).load( $.proxy( this.scrollToEnd, this ) );
			$( window ).on( 'resize', $.proxy( this.scrollToEnd, this ) );

		},

		scrollToEnd: function() {

			this.el.scrollLeft( 9999 );

		}

	};

	$( function() {
		$( '[data-js-breadcrumbs]' ).each( function() {
			Object.create( Breadcrumbs ).init( $( this ) );
		} );
	} );

} )( jQuery );