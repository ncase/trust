SLIDES.push({
	id: "credits",
	onstart: function(self){	
		self.add({ id:"bg", type:"Background", color:"#222" });

		// Circular Wordbox
		self.add({
			id:"text", type:"TextBox",
			x:160, y:70, width:640, height:500, align:"center",
			text_id:"credits_beta", color:"#fff"
		});
	}
});