var Text_Adder = function() {}

var add_text = function(stuff_text, main_topic, m) {
	this.manager = m;

    var init_width = 1200
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        },
        width = init_width - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    var split_amount = 120
    var word_number_width = init_width / split_amount;

    this.main_topic = main_topic
    
    this.words = stuff_text.split(" ");

    text_box = d3.select("#selectingText").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom);
    this.group1 = text_box.append("g");
    this.group2 = text_box.append("g");

    this.mtt = this.group1.selectAll("text");
    this.mtt.data(this.main_topic).enter().append("text")
        .attr("x", 0)
        .attr("y", 15)
        .text(function(d) {
            return d;
        })
        .on("click", function(d) {
            this.style.fill = getNextColor(this.style.fill);
        });


    this.tb = this.group2.selectAll("text");
    this.tb.data(this.words).enter().append("text")
        .attr("x", function(d, i) {
            return (i % word_number_width) * 100;
        })
        .attr("y", function(d, i) {
            return (Math.floor(i / word_number_width) + 3) * 15;
        })
        .text(function(d) {
            return d;
        })
        .attr("id", function(d, i) { return ("word_label_" + i)})
        .on("click", function(d) {
            this.style.fill = getNextColor(this.style.fill);
        });
}

var refresh = function() {
	//not sure what I would put here
}

var clear = function (){
	d3.select("#selectingText").select("svg").remove();
}

function getNextClass(current_class) {}

function getCSSClass(d) {
    if (d.select) {
        return "selected";
    } else {
        if (d.dep_sel) {
            return "dep_sel"
        } else {
            return "dot";
        }
    }
}

function getColorFromName(name){
    if (name == "specialty") { //if black not selected
        return "rgb(255, 0, 0)";
    } else if (name == "organ") { //if red:spec
        return "rgb(0, 128, 0)";
    } else if (name == "body_point") { //if green: organ
        return "rgb(0, 0, 255)";
    } else if (name == "") { 
        return "rgb(255, 128, 0)";
    } else if (name == "") {
        return "rgb(128, 0, 128)";
    } else if (name == "") {
        return "rgb(255,105,180)";
    } else {
        return "";
    }
}

function getNextColor(current_color) {
    if (current_color == "") { //if black not selected
        return "red";
    } else if (current_color == "rgb(255, 0, 0)") { //if red:spec
        return "green";
    } else if (current_color == "rgb(0, 128, 0)") { //if green: organ
        return "blue";
    } else if (current_color == "rgb(0, 0, 255)") { //which leaves blue
        return "rgb(255, 128, 0)";
    } else if (current_color == "rgb(255, 128, 0)") {
        return "purple";
    } else if (current_color == "rgb(128, 0, 128)") {
        return "rgb(255,105,180)";
    } else {
        return "";
    }
    //can you use a case box for this? 
    //not sure if it exists in javascript
}

function getType(ty){
	var ret_type = [];
	if (this.mtt.style("fill") == getColorFromName(ty))
	{
		ret_type.push(this.mtt.main_topic);
	}
	this.words.forEach(function (word)
	{
		if (word.c == ty)
		{
			ret_type.push(word);
		}
	});
	return ret_type;
}

//other things. where is the main topic? 
//force them to put in the main topic before they are allowed
//to start highlighting things.
//don't save on each press, save when you are done with it.

//when you get to the color of a body point you need to move
//to add mode until things clear up

//I think you need clearer "modes" 

var add_points = function ()
{
	var names = this.getType("body_point");
	this.new_points = this.manager.add_points_with_names(names);
	
}

Text_Adder.prototype.constructor = Text_Adder;
Text_Adder.prototype.add_text = add_text;
Text_Adder.prototype.clear = clear;
Text_Adder.prototype.refresh = refresh;
Text_Adder.prototype.getType = getType;
Text_Adder.prototype.add_points = add_points