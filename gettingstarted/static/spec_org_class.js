function draw_specialties() {

    var text = spec_svg.selectAll("text");
    var j = 1
    selected_parts.forEach(function(sp) {
        text.data(sp.specialty_name).enter().append("text")
            .attr("x", 5)
            .attr("y", function(d, i) {
                return 50 * (i + 1) * j;
            })
            .text(function(d) {
                return d;
            });
        j++;
    });
}

function draw_organs() {

    var text = spec_svg.selectAll("text");
    selected_parts.forEach(function(sp) {
        text.data(sp.specialty_name).enter().append("text")
            .attr("x", 5)
            .attr("y", function(d, i) {
                return 50 * (i + 1);
            })
            .text(function(d) {
                return d;
            });
    });
}

var Specialty = function(sp) {
    this.speciaties = sp;
    var text = spec_svg.selectAll("text");
    text.data(specialties).enter().append("text")
        .attr("x", 5)
        .attr("y", function(d, i) {
            return 20 * (i + 1);
        })
        .text(function(d) {
            return d.name;
        })
        .attr("class", function(d) {
            if (d.select) {
                return "selected";
            } else {
                return "dot";
            }
        });
}

Specialty.prototype.constructor = Specialty;


var Organ = function() {
    var text = org_svg.selectAll("text");
    text.data(organs).enter().append("text")
        .attr("x", 5)
        .attr("y", function(d, i) {
            return 20 * (i + 1);
        })
        .text(function(d) {
            return d.name;
        })
        .attr("class", function(d) {
            if (d.select) {
                return "selected";
            } else {
                return "dot";
            }
        })
}
Organ.prototype.constructor = Organ;