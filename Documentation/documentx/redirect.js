myPluginLoadEvent(function() { 
   if(window.top.location.hash == "") 
   { 
		// Display a popup at the top of a page with option to redirect to webframe.html#page.html  
		var div = $('<div />', {
                id   : "alertmsg",
				style : "background: linear-gradient(to bottom, #2da61b 0%, #60c251 100%); color: white; padding:10px; margin-top: -8px; cursor: pointer; font-weight:bold;",                
                }).append($('<span/>',{
					text : "SciChart Documentation is best viewed inside a Navigation Frame.",
				})).append($('<div/>',{
					style : "align: right; background: linear-gradient(to bottom, #575757 0%, #000000 100%); font-weight: bold; margin-left: 15px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); display: inline-block; padding: 5px 10px;",
					text : "Click HERE to load it!",
				}));            
		div.on("click", function() {
			div.fadeOut("slow").queue(function() { 
				document.getElementById('viewInFrameLink').click(); 
			});			
		});
		$('body').prepend(div.fadeIn("slow"));
      } 
}); 
// safe window.loaded event hook                                           
function myPluginLoadEvent(func) {       
   // assign any pre-defined functions on 'window.onload' to a variable       
   var oldOnLoad = window.onload;       
   // if there is not any function hooked to it       
   if (typeof window.onload != 'function') {       
     // you can hook your function with it       
     window.onload = func       
   } else { // someone already hooked a function       
     window.onload = function () {       
       // call the function hooked already       
       oldOnLoad();       
       // call your awesome function       
       func();       
     }       
  }       
}       
