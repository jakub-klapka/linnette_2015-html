/* global jQuery, autosize */
( function( $ ){

	var AutoShowing = {

		init: function( el ) {

			this.source = el;
			this.target = $( '[data-js-hidden_target=' + this.source.data( 'js-hidden_source' ) + ']' );
			this.hidden = true;

			this.bindEvents();
		},

		bindEvents: function() {

			this.source.on( 'focus', $.proxy( this.showTarget, this ) );

		},

		showTarget: function() {
			if( this.hidden === true ) {
				this.target.velocity( 'slideDown' );
				this.hidden = false;
			}
		}

	};


	//DOM ready
	$( function() {

		autosize( $( '.form textarea' ) );

		$( '[data-js-hidden_source]' ).each( function(){
			Object.create( AutoShowing ).init( $( this ) );
		} );

	} );

} )( jQuery );