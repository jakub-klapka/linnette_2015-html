!function(i){var e={init:function(){this.library_url="https://linnette.api.oneall.com/socialize/library.js",this.textarea=i('[data-js-social_login="textarea"]'),this.button=i('[data-js-social_login="button"]'),this.oneall=i('[data-js-social_login="oneall_container"]'),this.bindEvents()},bindEvents:function(){t=this,this.button.on("click",function(i){i.preventDefault(),t.runOneAll()}),this.checkForExistingSessionStorage()},runOneAll:function(){this.textarea.attr("disabled","disabled"),this.button.attr("disabled","disabled"),this.oneall.velocity("slideDown"),i.getScript(this.library_url),this.saveToSessionStorage()},saveToSessionStorage:function(){window.sessionStorage&&window.sessionStorage.setItem("comment",this.textarea.val())},checkForExistingSessionStorage:function(){window.sessionStorage&&null!==window.sessionStorage.getItem("comment")&&(window.location.hash="#comments",this.textarea.val(window.sessionStorage.getItem("comment")),window.sessionStorage.clear(),i(document).trigger("lumi_comments_already_set"))}};i(function(){e.init()})}(jQuery);