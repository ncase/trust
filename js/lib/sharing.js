window.addEventListener("load",function(){

	// Find the "sharing" dom
	var sharingDOM = document.body.querySelector("sharing");

	// URL encodeable
	var title = sharingDOM.getAttribute("title");
	var text = sharingDOM.getAttribute("text");
	var link = sharingDOM.getAttribute("link");
	text = encodeURIComponent(text);
	link = encodeURIComponent(link);

	// Create full html
	var sharing = document.createElement("div");
	sharing.className = "sharing";
	sharing.innerHTML = '<a href="https://www.facebook.com/sharer/sharer.php?u='+link+'&t='+text+'" title="Share on Facebook" target="_blank"><img alt="Share on Facebook" src="social/facebook.png"></a>'+
						'<a href="https://twitter.com/intent/tweet?source='+link+'&text='+text+'%20'+link+'" target="_blank" title="Tweet"><img alt="Tweet" src="social/twitter.png"></a>'+
						'<a href="mailto:?subject='+title+'&body='+text+" "+link+'" target="_blank" title="Send email"><img alt="Send email" src="social/email.png"></a>';

	// Replace it in the dom
	sharingDOM.parentNode.replaceChild(sharing, sharingDOM);

});