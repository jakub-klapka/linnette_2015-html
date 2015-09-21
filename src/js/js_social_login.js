/* global jQuery */
( function( $ ){

	var SocialLogin = {

		init: function() {

			this.library_url = 'https://linnette.api.oneall.com/socialize/library.js';

			this.textarea = $( '[data-js-social_login="textarea"]' );
			this.button = $( '[data-js-social_login="button"]' );
			this.oneall = $( '[data-js-social_login="oneall_container"]' );

			this.bindEvents();

		},

		bindEvents: function () {

			t = this;
			this.button.on( 'click', function( evt ){
				evt.preventDefault();
				t.runOneAll();
			} );

			this.checkForExistingSessionStorage();

		},

		runOneAll: function() {

			this.textarea.attr( 'disabled', 'disabled' );
			this.button.attr( 'disabled', 'disabled' );
			this.oneall.velocity( 'slideDown' );
			$.getScript( this.library_url );

			this.saveToSessionStorage();

		},

		saveToSessionStorage: function() {
			if( window.sessionStorage ) {

				window.sessionStorage.setItem( 'comment', this.textarea.val() );

			}
		},

		checkForExistingSessionStorage: function() {
			if( window.sessionStorage ) {

				if( window.sessionStorage.getItem( 'comment' ) !== null ){

					window.location.hash = '#comments';
					this.textarea.val( window.sessionStorage.getItem( 'comment' ) );
					window.sessionStorage.clear();
					$( document ).trigger( 'lumi_comments_already_set' );

				}

			}
		}

	};


	$( function() {
		SocialLogin.init();
	} );

} )( jQuery );