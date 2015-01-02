function get_CSS_Class(d) {
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

var Manager = function() {
    this.plot1 = new Plot(this, 1);
    this.plot2 = new Plot(this, 2);
    this.plot3 = new Plot(this, 3);
    this.spec_list = new Spec_list(this);
    this.org_list = new Org_list(this);
    this.text_adder = new Text_Adder(this)
}

var updateManager = function() {
    this.plot1.selectAll("circle").data(body_part).enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", this.plot1.xMap)
        .attr("cy", this.plot1.yMap)
        .attr("class", function(d) {
            return get_CSS_Class(d);
        });
    this.plot2.selectAll("circle").data(body_part).enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", this.plot2.xMap)
        .attr("cy", this.plot2.yMap)
        .attr("class", function(d) {
            return get_CSS_Class(d);
        });
    this.plot3.selectAll("circle").data(body_part).enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", this.plot3.xMap)
        .attr("cy", this.plot3.yMap)
        .attr("class", function(d) {
            return get_CSS_Class(d);
        });
    this.plot1.update();
    this.plot2.update();
    this.plot3.update();
    this.spec_list.update();
    this.org_list.update();
}

var select_point = function(point) {
    point.organ_names.forEach(function(p_o) {
        organs.forEach(function(o) {
            if (p_o == o.name) {
                o.dep_sel = true;
            }
        });
    });
    this.org_list.update();

    point.specialty_names.forEach(function(p_sp) {
        specialties.forEach(function(sp) {
            if (p_sp == sp.name) {
                sp.dep_sel = true;
            }
        })
    });
    this.spec_list.update();
}

var deselect_point = function(point) {
    point.organ_names.forEach(function(p_o) {
        organs.forEach(function(o) {
            if (p_o == o.name) {
                o.dep_sel = false;
            }
        });
    });
    selected_parts.forEach(function(point) {
        point.organ_names.forEach(function(p_o) {
            organs.forEach(function(o) {
                if (p_o == o.name) {
                    o.dep_sel = true;
                }
            });
        });
    });
    this.org_list.update();

    point.specialty_names.forEach(function(p_sp) {
        specialties.forEach(function(sp) {
            if (p_sp == sp.name) {
                sp.dep_sel = false;
            }
        })
    });
    selected_parts.forEach(function(point) {
        point.specialty_names.forEach(function(p_sp) {
            specialties.forEach(function(sp) {
                if (p_sp == sp.name) {
                    sp.dep_sel = true;
                }
            });
        });
    });
    this.spec_list.update();
}

var select_spec = function() {

    selected_specs.forEach(function(p) {
        p.specialty_names.forEach(function(p_sp) {
            specialties.forEach(function(sp) {
                if (p_sp == sp.name) {
                    sp.dep_sel = !sp.dep_sel;
                }
            })
        });
    });
    this.spec_list.update();
}

var select_org = function() {
    selected_parts.forEach(function(p) {
        p.organ_names.forEach(function(p_o) {
            organs.forEach(function(o) {
                if (p_o == o.name) {
                    o.dep_sel = !o.dep_sel;
                }
            })
        });
    });
    this.org_list.update();
}

var refresh = function() {
    this.plot1.refresh();
    this.plot2.refresh();
    this.plot3.refresh();
    this.spec_list.refresh();
    this.org_list.refresh();
    //this.text_adder.refresh();
}

var add_points_with_names = function (names) {
    add_mode =  true;
    d3.select("#select_btn").classed("button", false);
    document.getElementById("select_btn").disabled = false;
    d3.select("#add_btn").classed("button", true);
    document.getElementById("add_btn").disabled = true;
    document.getElementById("save_btn").disabled = false;
    document.getElementById("divAdd").style.visibility = "visible";
    names.forEach(function (name)
    {
        alert("add point location for", name);
        
    })
}

Manager.prototype.constructor = Manager;
Manager.prototype.update = updateManager;
Manager.prototype.refresh = refresh;
Manager.prototype.select_point = select_point;
Manager.prototype.select_spec = select_spec;
Manager.prototype.select_org = select_org;
Manager.prototype.deselect_point = deselect_point;
Manager.prototype.add_points_with_names = add_points_with_names;