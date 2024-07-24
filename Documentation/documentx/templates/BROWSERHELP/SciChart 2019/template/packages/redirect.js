// Redirect.js
// Copyright SciChart (C) 2024. 
// 
// Resolves issue in DocumentX HelpStudio where google pages land on non-webframed pages 
// provides a button to redirect to webframe version & saves the user preference in a domain cookie 

function addRedirect() {
	if(window.top.location.hash === "") { 				
		var documentationCookie = getCookie("_scDocsRedirect");
		if (isEmpty(documentationCookie)) {					
			// When no # in URL, display a popup at the top of a page with option to redirect to webframe.html#page.html  
			var div = $('<div />', {
					id   : "alertmsg",						
					}).append($('<span/>',{
						text : "SciChart Documentation is best viewed inside a Navigation Frame.",
					})).append($('<div/>',{
						class: 'click-here',
						text : "Click HERE to load it!",
					}));            
			div.on("click", function() {
				div.fadeOut("slow").queue(function() { 						    
					// Save the cookie 
					setCookie("_scDocsRedirect", "true", 365);
					// Redirect to webframe 
					doRedirect();
				});			
			});			
			$('body').prepend(div.fadeIn("slow"));
		}				
		else {
			// If Cookie exists, redirect now 
			doRedirect();
		}
	} 
}

function addLinkIcons() {	
	const links = document.querySelectorAll('a[href*="js/current/typedoc"]');
	links.forEach(link => {
	  // Create the icon element
	  const icon = document.createElement('i');
	  icon.className = 'fas fa-book'; // Font Awesome book icon class
	  icon.style.marginLeft = '5px'; // Space between link and icon	  
  
	  // Extract the text inside the <a> element
	  const linkText = link.textContent.trim();

	  // Set the title attribute on the <a> element
	  link.title = `View ${linkText} on the TypeDoc API Documentation`;

	  // Append the icon to the link
	  link.appendChild(icon);
	});
}
		
function isEmpty(str) {
	return (!str || 0 === str.length);
}

// Do the redirect to the navigation-frame version of docs 
function doRedirect() {
	var url = window.location.href;
	window.location.href = url.substr(0, url.lastIndexOf("/")+1) + "webframe.html#" + url.substr(url.lastIndexOf("/")+1, url.length-1);
	//document.getElementById('viewInFrameLink').click(); 
}
			
// safe window.loaded event hook                                           
function onWindowLoadedDo(func) {              
	var oldOnLoad = window.onload;       
	if (typeof window.onload != 'function') {       
		window.onload = func;    
	} else { 
		window.onload = function () {       
			oldOnLoad();         
			func();       
		};      
	}       
}       

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname +"=" + cvalue + ";path=/;expires=" + d;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}  

onWindowLoadedDo(function() { 
	addRedirect();
}); 

document.addEventListener('DOMContentLoaded', () => {
	addLinkIcons();
});
