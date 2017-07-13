// THE TRUST GAME - COOPERATE, YA NO?
SLIDES.push({

	id: "oneoff",

	onstart: function(self){

		// Iterated Simulation
		self.add({id:"iterated", type:"Iterated", x:130, y:133});

		// Words on top & bottom
		self.add({
			id:"topWords", type:"TextBox", text_id:"oneoff_0_top",
			x:80, y:10, width:800, height:100, align:"center"
		});
		self.add({
			id:"btmWords", type:"TextBox", text_id:"oneoff_0_btm",
			x:80, y:397, width:800, height:100, align:"center"
		});

		// Buttons
		self.add({
			id:"btnCheat", type:"Button", x:275, y:463, text_id:"label_cheat", uppercase:true,
			onclick:function(){
				_.answer = "CHEAT";
				publish("slideshow/next");
			}
		});
		self.add({
			id:"btnCooperate", type:"Button", x:495, y:460, text_id:"label_cooperate", uppercase:true,
			onclick:function(){
				_.answer = "COOPERATE";
				publish("slideshow/next");
			}
		});

	}

},{

	onstart: function(self){

		// Payoff
		self.objects.iterated.oneoffHighlight1();

		// Text
		var t = self.objects.topWords;
		var b = self.objects.btmWords;
		if(_.answer=="COOPERATE"){
			t.setText(Words.get("oneoff_1_cooperated")+" "+Words.get("oneoff_1_top"));
		}else{
			t.setText(Words.get("oneoff_1_cheated")+" "+Words.get("oneoff_1_top"));
		}
		b.setTextID("oneoff_1_btm");
	}

},{

	onstart: function(self){

		// Payoff
		self.objects.iterated.oneoffHighlight2();

		// Text
		var t = self.objects.topWords;
		var b = self.objects.btmWords;
		if(_.answer=="COOPERATE"){
			t.setText(Words.get("oneoff_2_cooperated")+" "+Words.get("oneoff_2_top"));
		}else{
			t.setText(Words.get("oneoff_2_cheated")+" "+Words.get("oneoff_2_top"));
		}
		b.setTextID("oneoff_2_btm");

		// Replace button
		self.remove("btnCheat");
		self.remove("btnCooperate");
		self.add({
			id:"btnNext", type:"Button", x:385, y:460, text_id:"oneoff_button_next",
			message:"slideshow/next"
		});

	},

	onend: function(self){
		self.objects.iterated.dehighlightPayoff();
		self.remove("topWords");
		self.remove("btmWords");
		self.remove("btnNext");
	}

});

