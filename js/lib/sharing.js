window.addEventListener("load",function(){

	// Find the "sharing" dom
	var sharingDOM = document.body.querySelector("sharing");

	// URL encodeable
	var title = sharingDOM.getAttribute("title");
	var text = sharingDOM.getAttribute("text");
	var link = sharingDOM.getAttribute("link");
	text = encodeURIComponent(text);
	link = encodeURIComponent(link);

	var facebook = sharingDOM.getAttribute("facebook");
	var twitter = sharingDOM.getAttribute("twitter");
	var email = sharingDOM.getAttribute("email");

	// Create full html
	var sharing = document.createElement("div");
	sharing.className = "sharing";
	sharing.innerHTML = '<a href="https://www.facebook.com/sharer/sharer.php?u='+link+'&t='+text+'" title="'+facebook+'" target="_blank"><img alt="'+facebook+'" src="social/facebook.png"></a>'+
                        '<a href="https://twitter.com/intent/tweet?source='+link+'&text='+text+'%20'+link+'" target="_blank" title="'+twitter+'"><img alt="'+twitter+'" src="social/twitter.png"></a>'+
                        '<a href="mailto:?subject='+title+'&body='+text+" "+link+'" target="_blank" title="'+email+'"><img alt="'+email+'" src="social/email.png"></a>';

	// Replace it in the dom
	sharingDOM.parentNode.replaceChild(sharing, sharingDOM);

});
