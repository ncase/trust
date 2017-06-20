var slides = [

// SIM
{
	id: "sim",
	add:[
		{id:"tournament", type:"TournamentSim", x:0, y:20}
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
		{id:"wordbox1", type:"WordBox", x:500, y:0, width:100, height:200, text:"foo bar foo bar foo bar"},
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