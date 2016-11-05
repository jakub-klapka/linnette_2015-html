( function( $ ){

	var PhotoSelection = {

		/**
		 * Holding whole current gallery
		 */
		wraper: undefined,

		/**
		 * Holds all checkboxes in current gallery
		 */
		checkboxes: undefined,

		/**
		 * All checkbox labels - for styling purposes
		 */
		labels: undefined,

		/**
		 * Constructor, fired for each gallery
		 *
		 * @param wraper jQuery
		 */
		init: function( wraper ) {
			/**
			 * Elements finding
			 */
			this.wraper = wraper;
			this.checkboxes = wraper.find( '.photo_selection__checkbox' );
			this.labels = wraper.find( '.photo_selection__checkbox__label' );

			/**
			 * Events
			 */
			this.removeCheckboxClickBubble();
			this.toggleWrapClassOnCheck();

		},

		/**
		 * As checkboxes are inside figure, click on them would normally propagate to open lightbox.
		 * We don't want that
		 */
		removeCheckboxClickBubble: function() {
			this.checkboxes.add( this.labels ).on( 'click', function( event ) {
				event.stopPropagation();
			} );
		},

		/**
		 * On checkbox status change, image wrap should (don't) have appropriate class for styling
		 */
		toggleWrapClassOnCheck: function() {
			this.checkboxes.on( 'change', function() {
				var checkbox = $( this );
				var parent_wrap = checkbox.parents( '.images_list__item' );
				if( checkbox.is( ':checked' ) ) {
					parent_wrap.addClass( 'is-checked' )
				} else {
					parent_wrap.removeClass( 'is-checked' )
				}
			} );
		}

	};

	$( function() {
		$( '.photo_selection' ).each( function() {
			Object.create( PhotoSelection ).init( $( this ) );
		} );
	} );

} )( jQuery );