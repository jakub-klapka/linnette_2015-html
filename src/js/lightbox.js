/* global jQuery */
( function( $ ){

	$( function(){

		var figures = $( '.article_gallery figure, .images_list:not(.is-photo_selection) .images_list__item, [data-js-lightbox]' );

		figures.on( 'click', function(){

			var index = figures.index( $( this ) );

			var psitems = [];

			figures.each( function(){
				var t = $( this ),
					img = t.find( 'img' );
				psitems.push( {
					src: img.data( 'url' ),
					w: img.data( 'width' ),
					h: img.data( 'height' ),
					title: t.find( 'figcaption' ).text()
				} );

			} );

			var options = {
				index: index,
				showHideOpacity: true,
				loop: false,
				shareEl: false
			};

			var gallery = new PhotoSwipe( document.querySelectorAll('.pswp')[0], PhotoSwipeUI_Default, psitems, options );
			gallery.init();

		} );



	} );

} )( jQuery );
