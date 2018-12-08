/* global jQuery, enquire */
( function( $ ){

	var Menu = {

		init: function() {

			this.header = $( '[data-js-main_header]' );
			this.duration = 300;
			this.button = $( '[data-js-menu_button]' );
			this.menu_open = false;
			this.header_hidden = false;
			this.mobile_header = $( '[data-js-mobile_header]' );
			this.scroll_to_top_button = $( '[data-js-scroll_to_top_button]' );
			this.scroll_to_top_button_visible = false;
			this.scroll_to_top_trehsold = 1500;
			this.window = $(window);

			this.bindEvents();

		},

		bindEvents: function() {

			var t = this;
			this.button.on( 'click', function(){
				if( t.menu_open ) {
					t.closeMenu();
				} else {
					t.openMenu();
				}
			} );

			this.scroll_to_top_button.on( 'click', function() {
				$('html').velocity( 'scroll', { offset: 0 } );
			} );
			
			this.window.scroll( (function() {

				if( this.scroll_to_top_button_visible === false && this.window.scrollTop() > this.scroll_to_top_trehsold ) {
					this.scroll_to_top_button.removeClass( 'is-hidden' );
					this.scroll_to_top_button_visible = true;
				}

				if( this.scroll_to_top_button_visible === true && this.window.scrollTop() <= this.scroll_to_top_trehsold ) {
                    this.scroll_to_top_button.addClass( 'is-hidden' );
                    this.scroll_to_top_button_visible = false;
				}

			}).bind(this) );

			enquire.register( 'only screen and (max-width: 480px)', {
				match: $.proxy( this.bindMobileHiding, this ),
				unmatch: $.proxy( this.unBindMobileHiding, this )
			} );

		},

		bindMobileHiding: function() {
			var t = this;
			this.mobile_header.headroom( {
				onPin: function() {
					t.showHeader();
				},
				onUnpin: function() {
					t.hideHeader()
				},
				onTop: function() {
					t.showHeader();
				}
			} );
		},

		unBindMobileHiding: function() {
			this.mobile_header.data( 'headroom' ).destroy();
			this.mobile_header.data( 'headroom', false );
			this.showHeader();
		},

		closeMenu: function() {
			this.menu_open = false;
			var complete_fnc = function( el ){
				$( el ).attr( 'style', '' );
			};
			this.header.removeClass( 'is-open' ).velocity( 'stop' ).velocity( 'fadeOut', { duration: this.duration, complete: complete_fnc } );
			this.button.removeClass( 'is-active' );
		},

		openMenu: function() {
			this.menu_open = true;
			this.header.addClass( 'is-open' ).velocity( 'stop' ).velocity( 'fadeIn', { duration: this.duration, display: 'flex' } );
			this.button.addClass( 'is-active' );
		},

		hideHeader: function() {
			if( !this.header_hidden && !this.menu_open ) {
				this.header_hidden = true;

				this.mobile_header.velocity( 'stop' ).velocity( 'slideUp', { duration: this.duration } );
				this.button.velocity( 'stop' ).velocity( 'slideUp', { duration: this.duration } );
			}
		},

		showHeader: function() {
			if( this.header_hidden ) {
				this.header_hidden = false;

				var complete_fnc = function( el ) {
					$( el ).attr( 'style', '' );
				};

				this.mobile_header
					.velocity( 'stop', true )
					//.attr( 'style', '' )
					.velocity( 'slideDown', { duration: this.duration, display: 'flex', complete: complete_fnc } );

				this.button
					.velocity( 'stop', true )
					//.attr( 'style', '' )
					.velocity( 'slideDown', { duration: this.duration, display: 'block', complete: complete_fnc } );
			}
		}

	};



	$( function() {
		Menu.init();
	} );

} )( jQuery );