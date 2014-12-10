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

function draw_organs() {

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

var Specialty = function() {
    //this is where you build the list of text specialities from database

}
Specialty.prototype.constructor = Specialty;


var Organ = function() {
    //this is where you build the list of text specialities from database
}
Organ.prototype.constructor = Organ;