//var Plot = function(p, which_plot) {
//}

//when I go to draw specialities I should make a list of selected body_parts

function draw_specialties() {

    var text = spec_svg.selectAll("text");
    var j = 1
    selected_parts.forEach( function(sp)
    {
    text.data(sp.specialty_name).enter().append("text")
        .attr("x", 5)
        .attr("y", function(d, i) {
            return 50*(i+1)*j;
        })
        .text(function(d) {
            return d;
        });
        j++;
    });
    
}

//var Manager = function() {
//    this.plot1 = new Plot(this, 1);
//    this.plot2 = new Plot(this, 2);
//    this.plot3 = new Plot(this, 3);
//}

//Manager.prototype.constructor = Manager;

//Plot.prototype.constructor = Plot;
//Plot.prototype.update = update;