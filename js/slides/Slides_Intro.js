SLIDES.push({

	id: "intro",
	add:[

		// Splash in background
		{ id:"splash", type:"Splash" },

		// Circular Wordbox
		{
			id:"intro_text", type:"TextBox",
			box:{
				x:160, y:10, width:640, height:500,
				align:"center", size:19,
				text_id:"intro"
			}
		},

		// Button
		{
			id:"intro_button", type:"Button", x:385, y:466, 
			text_id:"intro_button", fontSize:16, upperCase:false,
			message:"slideshow/scratch"
		}

	],
	removeAllOnKill: true

});