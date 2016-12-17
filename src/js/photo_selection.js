( function( $ ){

	/**
	 * Handle All Photo Selection actions
	 *
	 * API:
	 * For save only, fire POST request with all standard form data to form action URL
	 * with added data: 'action': 'save_selection'. Expecting JSON response with:
	 * { "result": "saved" }, or with error message: { "error": "Friendly error text" }.
	 *
	 * For final form submission, submit form with all standards through button:
	 * <button type="submit" name="form_submit" value="1">. In this case, we are expecting
	 * full HTML response with updated data.
	 *
	 */
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
		 * All Figures in current gallery
		 */
		figures: undefined,

		/**
		 * Instance of Photoswipe, once initialized
		 */
		photoswipe: undefined,

		/**
		 * Button inside PSWP, which selects images
		 */
		pswpSelectButton: undefined,

		/**
		 * Wrapper for Save and send actions
		 */
		actionsWrapper: undefined,

		/**
		 * Counter of selected photos
		 */
		counter: undefined,

		/**
		 * Button for save action
		 */
		saveButton: undefined,

		/**
		 * @var undefined|boolean
		 */
		formDisabled: undefined,

		/**
		 * Holds Form element
		 */
		form: undefined,

		/**
		 * URL for form submission
		 */
		formEndpoint: undefined,

		/**
		 * Indicates, if there are changes in checkboxes until last save
		 */
		changedSinceSave: undefined,

		/**
		 * Interval in ms for autosaving
		 */
		autosaveInterval: undefined,

		/**
		 * Is save currently in process
		 */
		currentlySaving: undefined,

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
			this.figures = wraper.find( '.images_list__item' );
			this.pswpSelectButton = $( '.pswp__linnete-photo-selection__button' );
			this.actionsWrapper = $( '.photo_selection_actions:first' );
			this.counter = this.actionsWrapper.find( '[data-photo_selection_counter]' );
			this.saveButton = this.actionsWrapper.find( '.photo_selection_actions__save_button' );
			this.formDisabled = $( '.pswp__linnete-photo-selection' ).hasClass( 'is-disabled' );
			this.form = $( '.photo_selection_form' );
			this.formEndpoint = this.form.attr( 'action' );
			this.changedSinceSave = false;
			this.autosaveInterval = 1000 * 60;
			this.currentlySaving = false;

			/**
			 * Events
			 */
			this.removeCheckboxClickBubble();
			this.toggleWrapClassOnCheck();
			this.bindPswpEvents();
			this.checkboxes.on( 'change', $.proxy( this.recalculateCounter, this ) );

			this.saveButton.on( 'click', function (event) { event.preventDefault(); } );
			this.saveButton.on( 'click', $.proxy( this.saveSelection, this ) );

			//Autosaving
			this.checkboxes.on( 'change', $.proxy( this.setChangedStatusForAutosave, this ) );
			setInterval( $.proxy( this.maybeAutosave, this ), this.autosaveInterval );
			$( window ).on( 'beforeunload', $.proxy( this.rejectLock, this ) );

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
		},

		/**
		 * Bind events, which are related to PSWP start
		 */
		bindPswpEvents: function () {
			var t = this;

			//Click on figure to init photoswipe
			this.figures.on( 'click', function(){
				t.initPswp( $( this ) );
			} );

			//Click on photo select button in PS
			if( !this.formDisabled ){
				this.pswpSelectButton.on( 'click', $.proxy( this.passButtonClickToCheckbox, this ) );
			}

		},

		/**
		 * Init and start photoswipe gallery
		 *
		 * @event click on figure
		 * @param clicked_figure
		 */
		initPswp: function( clicked_figure ) {

			var index = this.figures.index( clicked_figure );

			var psitems = [];

			this.figures.each( function(){
				var t = $( this ),
					img = t.find( 'img' );
				psitems.push( {
					src: img.data( 'url' ),
					w: img.data( 'width' ),
					h: img.data( 'height' ),
					title: t.find( 'figcaption' ).text(),
					id: t.find( '.photo_selection__checkbox' ).prop( 'id' )
				} );
			} );

			var options = {
				index: index,
				showHideOpacity: true,
				loop: false,
				shareEl: false
			};

			this.photoswipe = new PhotoSwipe( document.querySelectorAll('.pswp')[0], PhotoSwipeUI_Default, psitems, options );
			/*
			 * PSWP Events
			 */
			if( !this.formDisabled ) {
				this.bindWindowXKeySelections( true );
				this.photoswipe.listen( 'unbindEvents', $.proxy( this.bindWindowXKeySelections, this, false ) );
			}
			this.photoswipe.listen( 'beforeChange', $.proxy( this.setPswpImageSelectorValue, this ) );

			this.photoswipe.init();
		},

		/**
		 * Bind X key press to (de)select picture in PSWP
		 *
		 * @param on if true, we are binding event, if false, we are unbinding (gallery destroy)
		 */
		bindWindowXKeySelections: function( on ) {
			on = ( typeof on === 'undefined' ) ? false : true;

			if( on ) {
				//Press X in PS window to select picture
				$( document ).on( 'keypress.linn__ps_select_picture', $.proxy( function ( event ) {
					if( event.which === 120 ) {
						//X pressed
						this.passButtonClickToCheckbox();
					}
				}, this ) );
			} else {
				$( document ).off( 'keypress.linn__ps_select_picture' );
			}

		},

		/**
		 * On every photo change in PSWP, find related checkbox and set button inside pswp to correct value
		 *
		 * @event photoswipe.beforeChange
		 */
		setPswpImageSelectorValue: function () {

			var checkbox = this.wraper.find( '#' + this.photoswipe.currItem.id );

			if( checkbox.is( ':checked' ) ) {
				this.pswpSelectButton.addClass( 'is-selected' );
			} else {
				this.pswpSelectButton.removeClass( 'is-selected' );
			}

		},

		/**
		 * Handle PSWP select button click -> pass clicked value back to related checkbox in DOM
		 */
		passButtonClickToCheckbox: function () {

			var checkbox = this.wraper.find( '#' + this.photoswipe.currItem.id );
			if( !this.pswpSelectButton.hasClass( 'is-selected' ) ) {
				//Select checkbox
				checkbox.prop( 'checked', true ).trigger( 'change' );
				this.pswpSelectButton.addClass( 'is-selected' );
			} else {
				//Deselect checkbox
				checkbox.prop( 'checked', false ).trigger( 'change' );
				this.pswpSelectButton.removeClass( 'is-selected' );
			}

		},

		/**
		 * Count all selected checkboxes and update counter
		 */
		recalculateCounter: function() {
			var count = this.checkboxes.filter( ':checked' ).length;
			this.counter.text( count );
		},

		/**
		 * Handle Save action
		 *
		 * Expecting success json:
		 * { "result": "saved" }
		 * Or Fail json:
		 * { "error": "Friendly error text" }
		 */
		saveSelection: function () {
			this.currentlySaving = true;
			this.setButtonState( 'saving' );

			var data = this.form.serializeArray();
			data.push( {
				'name': 'photo_selection_action',
				'value': 'save_selection'
			} );

			var save_xhr = $.ajax( {
				'dataType': 'json',
				'method': 'POST',
				'url': this.formEndpoint,
				'data': data
			} );

			save_xhr.done( $.proxy( function( data ) {
				if( data.result === 'saved' ) {
					this.changedSinceSave = false;
					this.setButtonState( 'saved' );
				} else {
					alert( 'Nepodařilo se uložit výběr. Prosím, dejte nám o této chybě vědět. Děkujeme.' );
				}

				this.currentlySaving = false;

			}, this ) );

			save_xhr.fail( $.proxy( function( data ) {
				alert( 'Nepodařilo se uložit výběr. Prosím, dejte nám o této chybě vědět. Děkujeme.' );
				this.currentlySaving = false;
			}, this ) );

		},

		/**
		 * Set Save button appearance
		 *
		 * @param state must be one of [ 'saving, 'saved' ]
		 */
		setButtonState: function( state ) {
			if( state === 'saving' ) {
				this.saveButton.removeClass( 'is-saved' ).addClass( 'is-saving' ).prop( 'disabled', true );
			}
			if( state === 'saved' ) {
				this.saveButton.removeClass( 'is-saving' ).addClass( 'is-saved' ).prop( 'disabled', false );
				setTimeout( $.proxy( function() {
					this.saveButton.removeClass( 'is-saving' ).removeClass( 'is-saved' ).prop( 'disabled', false );
				}, this ), 4000 );
			}
		},

		/**
		 * On any checkbox change, set changedSinceSave for autosave handling
		 */
		setChangedStatusForAutosave: function () {
			this.changedSinceSave = true;
		},

		/**
		 * If there are changes since last save and we are not processing any other request, Save!
		 */
		maybeAutosave: function () {
			// if( this.currentlySaving === false && this.changedSinceSave ) {
			// Save even without changes - to extend session lock, TODO: move to low-cost keep-alives
			if( this.currentlySaving === false ) {
				this.saveSelection();
			}
		},

		/**
		 * Send request to reject lock on window close - allowing other person to update selection
		 *
		 * Don't bother with response
		 *
		 * @event window.onbeforeunload
		 */
		rejectLock: function () {

			var data = {
				'action': this.form.find( 'input[name="action"]' ).val(),
				'_wp_nonce': this.form.find( 'input[name="_wp_nonce"]' ).val(),
				'post_id': this.form.find( 'input[name="post_id"]' ).val(),
				'access_token': this.form.find( 'input[name="access_token"]' ).val(),
				'photo_selection_action': 'reject_lock'
			};

			$.ajax( {
				'dataType': 'json',
				'method': 'POST',
				'url': this.formEndpoint,
				'data': data
			} );

		}

	};

	/**
	 * DOM Ready
	 */
	$( function() {
		$( '.photo_selection' ).each( function() {
			Object.create( PhotoSelection ).init( $( this ) );
		} );

		$( 'form textarea' ).each( function() {
			autosize( this );
		} );
	} );

} )( jQuery );