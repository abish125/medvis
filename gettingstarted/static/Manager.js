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
    //make everything dep_sel false first

    body_part.forEach(function(bp)
    {
        bp.dep_sel = false;
    })
    organs.forEach(function(o)
    {
        o.dep_sel = false;
    })
    specialties.forEach(function(sp)
    {
        sp.dep_sel = false;
    })
    //go through all the points and highlight the spec and orgs
    //go through all the specs and orgs and highlight the points
    //then update everthing.

    selected_parts.forEach(function(selected_part)
    {
        selected_part.organ_names.forEach(function(selected_part_organ_name)
        {
            organs.forEach(function(organ)
            {
                if(selected_part_organ_name == organ.name)
                {
                    organ.dep_sel = true;
                }
            });
        });
    });

    selected_parts.forEach(function(selected_part)
    {
        selected_part.specialty_names.forEach(function(selected_part_specialty_name)
        {
            specialties.forEach(function(specialty)
            {
                if(selected_part_specialty_name == specialty.name)
                {
                    specialty.dep_sel = true;
                }
            });
        });
    });

    body_part.forEach(function(p) {
        p.organ_names.forEach(function(p_o) {
            selected_orgs.forEach(function(o) {
                if (p_o == o.name) {
                    p.dep_sel = true;
                }
            })
        });
    });


    selected_orgs.forEach(function(o) {
        o.specialties.forEach(function(sp_o)
        {
            specialties.forEach(function(specialty)
            {
                if (specialty.name == sp_o.name) {
                    specialty.dep_sel = true;
                }
            });
        });
    });

    body_part.forEach(function(p) {
        p.specialty_names.forEach(function(p_sp) {
            selected_specs.forEach(function(sp) {
                if (p_sp == sp.name) {
                    p.dep_sel = true;
                }
            })
        });
    });

    selected_specs.forEach(function(sp) {
        sp.organs.forEach(function(sp_org)
        {
            organs.forEach(function(organ)
            {
                if (sp_org.name == organ.name) {
                    organ.dep_sel = true;
                }
            });
        });
    });

    this.plot1.update();
    this.plot2.update();
    this.plot3.update();
    this.spec_list.update();
    this.org_list.update();
}

/**
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

//there has to be a way to to just update everything
//instead of having everything be done once at a time
//

var select_spec = function() {
    body_part.forEach(function(p) {
        p.specialty_names.forEach(function(p_sp) {
            specialties.forEach(function(sp) {
                if (p_sp == sp.name) {
                    p.dep_sel = !p.dep_sel;
                }
            })
        });
    });
    this.update();
}

var select_org = function() {
    body_part.forEach(function(p) {
        p.organ_names.forEach(function(p_o) {
            organs.forEach(function(o) {
                if (p_o == o.name) {
                    p.dep_sel = !p.dep_sel;
                }
            })
        });
    });
    this.update();
}
**/

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

/**
Manager.prototype.select_point = select_point;
Manager.prototype.select_spec = select_spec;
Manager.prototype.select_org = select_org;
Manager.prototype.deselect_point = deselect_point;
Manager.prototype.add_points_with_names = add_points_with_names;
**/