!function(i){i(function(){var t=i(".article_gallery figure, .images_list .images_list__item");t.on("click",function(){var e=t.index(i(this)),a=[];t.each(function(){var t=i(this),e=t.find("img");a.push({src:e.data("url"),w:e.data("width"),h:e.data("height"),title:t.find("figcaption").text()})});var n={index:e,showHideOpacity:!0,loop:!1,shareEl:!1},o=new PhotoSwipe(document.querySelectorAll(".pswp")[0],PhotoSwipeUI_Default,a,n);o.init()})})}(jQuery);