function PayoffsUI(config){

	var self = this;
	self.id = config.id;
	self.slideshow = config.slideshow;

	// Create DOM
	self.dom = document.createElement("div");
	self.dom.className = "object";
	var dom = self.dom;
	_configText(config, dom);
	if(config.scale){
		dom.style.transform = "scale("+config.scale+","+config.scale+")";
	}
	
	// Add Image Background
	var bg = new ImageBox({
		src: "assets/ui/payoffs_ui.png",
		x:0, y:0, width:300, height:300
	});
	dom.appendChild(bg.dom);

	// Labels
	dom.appendChild(_makeLabel("label_cooperate", {x:148, y:17, rotation:45, align:"center", color:"#cccccc"}));
	dom.appendChild(_makeLabel("label_cooperate", {x:52, y:17, rotation:-45, align:"center", color:"#cccccc"}));
	dom.appendChild(_makeLabel("label_cheat", {x:245, y:90, rotation:45, align:"center", color:"#cccccc"}));
	dom.appendChild(_makeLabel("label_cheat", {x:6, y:90, rotation:-45, align:"center", color:"#cccccc"}));

	// Inc(rement) De(crement) Numbers
	// which are symmetrical, and update each other!
	var numbers = [];
	var _makeIncDec = function(letter,x,y){
		(function(letter,x,y){

			var number = new IncDecNumber({
				x:x, y:y, max:5, min:-5,
				value: PD.PAYOFFS[letter],
				onchange: function(value){
					publish("pd/editPayoffs/"+letter,[value]);
					publish("payoffs/onchange");
				}
			});
			listen(self, "pd/editPayoffs/"+letter,function(value){
				number.setValue(value);
			});
			number.slideshow = self.slideshow;
			dom.appendChild(number.dom);
			numbers.push(number);

		})(letter,x,y);
	};

	_makeIncDec("R", 191-64, 127-47);
	_makeIncDec("R", 233-64, 127-47);

	_makeIncDec("T", 121-64, 197-47);
	_makeIncDec("S", 161-64, 197-47);

	_makeIncDec("S", 263-64, 197-47);
	_makeIncDec("T", 306-64, 197-47);

	_makeIncDec("P", 192-64, 268-47);
	_makeIncDec("P", 232-64, 268-47);

	// Add & Remove
	self.add = function(){ _add(self); };
	self.remove = function(){
		unlisten(self);
		for(var i=0;i<numbers.length;i++) unlisten(numbers[i]);
		for(var i=0;i<self.slideshow.dom.children.length;i++){
			if(self.slideshow.dom.children[i]==self.dom){
				_remove(self);
				break;
			}
		}
	};

}