/* global jQuery */
( function( $ ){

	$( window ).load( function(){

		setTimeout( function(){

			$.getScript( '//connect.facebook.net/cs_CZ/sdk.js', function(){
				var app_id = $( '.fb_share_area:first' ).data( 'app-id' );
				FB.init( { status: true, xfbml: true, version: 'v2.3', appId: app_id } );
			} );

		}, 5000 );

	} );

} )( jQuery );