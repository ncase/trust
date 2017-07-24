SLIDES.push({
	id: "conclusion",
	onstart: function(self){

		// WORDS
		self.add({
			id:"text1", type:"TextBox",
			x:3, y:6, width:800,
			text_id:"conclusion_0"
		});
		self.add({
			id:"text2", type:"TextBox",
			x:176, y:65-10, width:760, size:30, color:"#4089DD",
			text_id:"conclusion_1_a"
		});
		self.add({
			id:"text3", type:"TextBox",
			x:176, y:115-10, width:760,
			text_id:"conclusion_1_a2"
		});
		self.add({
			id:"text4", type:"TextBox",
			x:176, y:192-10, width:760, size:30, color:"#efc701",
			text_id:"conclusion_2_a"
		});
		self.add({
			id:"text5", type:"TextBox",
			x:176, y:242-10, width:760,
			text_id:"conclusion_2_a2"
		});
		self.add({
			id:"text6", type:"TextBox",
			x:176, y:316-10, width:760, size:30, color:"#DD4040",
			text_id:"conclusion_3_a"
		});
		self.add({
			id:"text7", type:"TextBox",
			x:176, y:366-10, width:760,
			text_id:"conclusion_3_a2"
		});
		self.add({
			id:"text8", type:"TextBox",
			x:74, y:440, width:520, align:"right",
			text_id:"conclusion_4"
		});

		// IMAGE
		self.add({
			id:"img", type:"ImageBox",
			src: "assets/conclusion/summary.png",
			x:10, y:60, width:140, height:350
		});

		// Button
		self.add({
			id:"button", type:"Button", x:615, y:481, 
			text_id:"conclusion_btn", size:"long",
			message:"slideshow/scratch"
		});

	},
	onend: function(self){
		self.clear();
	}
});

SLIDES.push({
	onstart: function(self){

		// Splash in background
		self.add({ id:"splash", type:"Splash", blush:true });

		// Circular Wordbox
		self.add({
			id:"text", type:"TextBox",
			x:160, y:10, width:640, height:500, align:"center",
			text_id:"outro_1"
		});

		// Button
		self.add({
			id:"button", type:"Button", x:385, y:466, 
			text_id:"outro_1_btn",
			message:"slideshow/next"
		});

	},
	onend: function(self){
		self.remove("text");
		self.remove("button");
	}
});

SLIDES.push({
	onstart: function(self){

		var o = self.objects;

		// Text
		self.add({
			id:"text", type:"TextBox",
			x:160, y:30, width:640, height:500, align:"center", size:22,
			text_id:"outro_2"
		});
		_hide(o.text); _fadeIn(o.text, 100);

		// Photo
		self.add({
			id:"img", type:"ImageBox",
			src: "assets/conclusion/truce.jpg",
			x:228, y:90, width:500,
		});
		_hide(o.img); _fadeIn(o.img, 200);

		// Text 2
		self.add({
			id:"text2", type:"TextBox",
			x:228, y:402, width:500,
			align:"center", color:"#aaa", size:14,
			text_id:"outro_2_credits"
		});
		_hide(o.text2); _fadeIn(o.text2, 200);

		// Button
		self.add({
			id:"button", type:"Button", x:427, y:466, 
			text_id:"outro_2_btn", size:"short",
			message:"slideshow/scratch"
		});
		_hide(o.button); _fadeIn(o.button, 2000);

	},
	onend: function(self){
		self.clear();
	}
});