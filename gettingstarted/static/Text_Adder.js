var Text_Adder = function(stuff_text, main_topic) {
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        },
        width = 500 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    words = stuff_text.split(" ");

    text_box = d3.select("#newText").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom);

    var tb = text_box.selectAll("text");
    tb.data(words).enter().append("text")
        .attr("x", function(d, i) {
        	console.log((i % 5) * 100)
            return (i % 5) * 100;
        })
        .attr("y", function(d, i) {
        	//console.log((Math.floor(i / 10)+1) * 15)
            return (Math.floor(i / 5)+1) * 15;
        })
        .text(function(d) {
        	console.log(d)
            return d;
        })
        .on("click", function(d) {
            this.style.fill = getNextColor(this.style.fill);
        });
}

function getNextColor(current_color) {
    if (current_color == "") {
        return "red";
    } else if (current_color == "rgb(255, 0, 0)") {
        return "green";
    } else if (current_color == "rgb(0, 128, 0)") {
        return "blue";
    } else {
        return "";
    }
    //can you use a case box for this? 
    //not sure if it exists in javascript
}

//other things. where is the main topic? 
//force them to put in the main topic before they are allowed
//to start highlighting things.
//don't save on each press, save when you are done with it.

//when you get to the color of a body point you need to move
//to add mode until things clear up

//I think you need clearer "modes" 

Text_Adder.prototype.constructor = Text_Adder;