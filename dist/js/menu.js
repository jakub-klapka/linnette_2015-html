!function(i){var e={init:function(){this.header=i("[data-js-main_header]"),this.duration=300,this.button=i("[data-js-menu_button]"),this.menu_open=!1,this.header_hidden=!1,this.mobile_header=i("[data-js-mobile_header]"),this.bindEvents()},bindEvents:function(){var e=this;this.button.on("click",function(){e.menu_open?e.closeMenu():e.openMenu()}),enquire.register("only screen and (max-width: 480px)",{match:i.proxy(this.bindMobileHiding,this),unmatch:i.proxy(this.unBindMobileHiding,this)})},bindMobileHiding:function(){var i=this;this.mobile_header.headroom({onPin:function(){i.showHeader()},onUnpin:function(){i.hideHeader()},onTop:function(){i.showHeader()}})},unBindMobileHiding:function(){this.mobile_header.data("headroom").destroy(),this.mobile_header.data("headroom",!1),this.showHeader()},closeMenu:function(){this.menu_open=!1;var e=function(e){i(e).attr("style","")};this.header.removeClass("is-open").velocity("stop").velocity("fadeOut",{duration:this.duration,complete:e}),this.button.removeClass("is-active")},openMenu:function(){this.menu_open=!0,this.header.addClass("is-open").velocity("stop").velocity("fadeIn",{duration:this.duration,display:"flex"}),this.button.addClass("is-active")},hideHeader:function(){this.header_hidden||this.menu_open||(this.header_hidden=!0,this.mobile_header.velocity("stop").velocity("slideUp",{duration:this.duration}),this.button.velocity("stop").velocity("slideUp",{duration:this.duration}))},showHeader:function(){if(this.header_hidden){this.header_hidden=!1;var e=function(e){i(e).attr("style","")};this.mobile_header.velocity("stop",!0).velocity("slideDown",{duration:this.duration,display:"flex",complete:e}),this.button.velocity("stop",!0).velocity("slideDown",{duration:this.duration,display:"block",complete:e})}}};i(function(){e.init()})}(jQuery);