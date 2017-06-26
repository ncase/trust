SLIDES.push({

	id: "sim",
	add:[

		// The tournament simulation
		{id:"tournament", type:"Tournament", x:0, y:20},

		// All the words!
		{
			id:"textbox", type:"TextBox",
			boxes:[
				{ x:500, y:0, width:460, height:50, text_id:"sandbox_1" },
				{ x:500, y:370, width:460, height:200, text_id:"sandbox_2" }
			]
		},

		// Buttons
		{
			id:"_b1", type:"Button", x:500, y:150, width:140,
			text_id: "label_play_tournament",
			message: "tournament/play"
		},
		{
			id:"_b2", type:"Button", x:500, y:220, width:140,
			text_id: "label_eliminate_bottom_5",
			message: "tournament/eliminate",
			active:false
		},
		{
			id:"_b3", type:"Button", x:500, y:290, width:140,
			text_id: "label_reproduce_top_5",
			message: "tournament/reproduce",
			active:false
		}

	]

});