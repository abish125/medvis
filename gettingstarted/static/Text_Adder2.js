var Text_Adder = function() {}

var add_text = function(stuff_text, main_topics, textbox_number) {
	this.textbox = "#selectingText" + textbox_number;
	this.textbox_number = textbox_number;

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
    this.mtt_counter = 0;
    stuff_text = stuff_text.replace(/[^\w\s]|_/g, function ($1) { return ' ' + $1 + ' ';}).replace(/[ ]+/g, ' ');
    this.words = stuff_text.split(' ');

    text_box = d3.select(this.textbox).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom)
        .attr("id", "selectingTextSvg");
    this.group1 = text_box.append("g");
    this.group2 = text_box.append("g");

    this.mtt = this.group1.selectAll("text");
    this.mtt.data([this.main_topic[0]]).enter().append("text")
        .attr("x", 0)
        .attr("y", 15)
        .text(function(d) {
            return d;
        })
        .attr("id", "main_topic")
        .on("click", function(d) {
            //console.log(this.style.fill);
            this.style.fill = getNextColor(this.style.fill);
            if (this.mtt_counter == this.main_topic.length-1)
            {
                this.mtt_counter = 0;
            }  
            else
            {
                this.mtt_counter = this.mtt_counter + 1;
            }
            this.text = this.main_topic[this.mtt_counter];
        });
        
    document.getElementById("selectingText"+this.textbox_number).style.height = ((Math.floor(this.words.length / word_number_width) + 3) * 15)+20
    document.getElementById("selectingTextSvg").style.height = ((Math.floor(this.words.length / word_number_width) + 3) * 15)

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
        .attr("id", function(d, i) { return ("word_label" + textbox_number + "_" + i)})
        .on("click", function(d) {
            //console.log(this.style.fill);
            this.style.fill = getNextColor(this.style.fill);
        });
}

var refresh = function() {
	//not sure what I would put here
}

var clear = function (){
	d3.select(this.textbox).select("svg").remove();
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
    if (name == "specialty") { 
        return "rgb(255, 0, 0)"; //red
    } else if (name == "organ") { 
        return "rgb(0, 128, 0)"; //green
    } else if (name == "body_point") { 
        return "rgb(0, 0, 255)"; //blue
    } else if (name == "finding") { 
        return "rgb(255, 128, 0)"; //orange
    } else if (name == "condition") {
        return "rgb(128, 0, 128)"; //purple
    } else if (name == "join") {
        return "rgb(255,105,180)"; //pink
    } else {
        return "";
    }
}

function getNextColor(current_color) {
    if (current_color == "") { //if black not selected
        return "red";
    } else if (current_color == "red") { //if red:spec  rgb(255, 0, 0)
        return "green";
    } else if (current_color == "green") { //if green: organ rgb(0, 128, 0)
        return "blue";
    } else if (current_color == "blue") { //blue  rgb(0, 0, 255)
        return "rgb(255, 128, 0)";
    } else if (current_color == "rgb(255, 128, 0)") { //pink?
        return "purple";
    } else if (current_color == "purple") { // purple rgb(128, 0, 128)
        return "rgb(255, 105, 180)";    // orange
    } else if (current_color == "rgb(255, 105, 180)") {
        return "rgb(13, 252, 244)";
    } else if (current_color =="rgb(13, 252, 244)") {
        return "brown";
    } else {
        return "";
    }
    //can you use a case box for this? 
    //not sure if it exists in javascript
}

function getType(ty){
	var ret_type = [];
    var ta = this;
	if (d3.select("#main_topic").style("fill") == getColorFromName(ty))
	{
		ret_type.push(ta.main_topic);
	}
    /**
	for(var i=0;i<ta.words.length;i++)
	{
		if (d3.select("#word_label" + this.textbox_number + "_" + i).style("fill") == getColorFromName(ty))
		{
            if(d3.select("#word_label" + this.textbox_number + "_" + (i-1)).style("fill") == getColorFromName("join"))
            {
                ret_type.push(ta.words[i-1] + " " ta.words[i])
            }
            else
            {
                ret_type.push(ta.words[i]);
            }
		}
	}
    **/
	return ret_type;
}

//other things. where is the main topic? 
//force them to put in the main topic before they are allowed
//to start highlighting things.
//don't save on each press, save when you are done with it.

//when you get to the color of a body point you need to move
//to add mode until things clear up

//I think you need clearer "modes" 

Text_Adder.prototype.constructor = Text_Adder;
Text_Adder.prototype.add_text = add_text;
Text_Adder.prototype.clear = clear;
Text_Adder.prototype.refresh = refresh;
Text_Adder.prototype.getType = getType;