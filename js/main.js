var slides = [

// SIM
{
	id: "sim",
	add:[
		{id:"tournament", type:"TournamentSim", x:0, y:20},
		{
			id:"_w1", type:"WordBox",
			x:500, y:0, width:460, height:50,
			text:"Let's say there are three kinds of players:<br>"+
			"<span style='color:#FF75FF;'>Always Cooperate</span>, "+
			"<span style='color:#52537F;'>Always Cheat</span> & "+
			"<span style='color:#4089DD;'>Tit For Tat</span>"+
			"<br><br>"+
			"What happens when you let a mixed population play against each other, and evolve over time?"
		},
		{
			id:"_b1", type:"Button",
			x:500, y:150, width:140,
			text:"1) play tournament",
			message:"tournament/play"
		},
		{
			id:"_b2", type:"Button",
			x:500, y:220, width:140,
			text:"2) eliminate bottom 5",
			message:"tournament/eliminate",
			active:false
		},
		{
			id:"_b3", type:"Button",
			x:500, y:290, width:140,
			text:"3) reproduce top 5",
			message:"tournament/reproduce",
			active:false
		},
		{
			id:"_w3", type:"WordBox",
			x:500, y:370, width:460, height:200,
			text:"Always Cheat dominates at first, but when it runs out of suckers to exploit, "+
			"its empires collapses – and the fairer Tit For Tat takes over.<br>"+
			"<br>"+
			"<i>We are not punished for our sins, but by them.</i><br>"+
			"- Elbert Hubbard"
		}
	]
},

// Intro
{
	id: "intro0",
	add:[
		{id:"button", type:"Button", x:550, y:200, width:100, height:100, text:"NEXT SLIDE", message:"slideshow/next"},
	]
},

// Intro 1
{
	id: "intro1",
	add:[
		{id:"wordbox1", type:"WordBox", x:500, y:0, width:100, height:200, text:"foo bar <b>foo bar</b> <i>foo<i> bar"},
	]
},

// Intro 2
{
	id: "intro2",
	add:[
		{id:"wordbox2", type:"WordBox", x:500, y:100, width:100, height:200, text:"even more foo bar"},
		{id:"silly", type:"SillyPixi", x:700, y:50, width:200, height:200}
	]
}, 

// Intro 3
{
	id: "intro3",
	remove:[
		{id:"wordbox1"},
		{id:"wordbox2"}
	],
	add:[
		{id:"wordbox3", type:"WordBox", x:500, y:0, width:100, height:200, text:"aaAAAAHHHHhhh"}
	]
},

// Intro 4
{
	id: "intro4",
	remove:[
		{id:"wordbox3"}
	]
},

// Intro 5
{
	id: "intro5",
	remove:[
		{id:"button"},
		{id:"silly"}
	],
	add:[
		{id:"the_end", type:"WordBox", x:600, y:300, width:100, height:200, text:"THE END"}
	]
}

];