/* global jQuery */
( function( $ ){

	$( window ).load( function(){

		setTimeout( function(){

			$.getScript( '//connect.facebook.net/cs_CZ/sdk.js', function(){
				FB.init( { status: true, xfbml: true, version: 'v2.3', appId: '214334225273929' } );
			} );

		}, 5000 );

	} );

} )( jQuery );