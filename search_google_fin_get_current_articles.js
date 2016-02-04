//use the google search casperjs thing that you got from subelsky or whoever (currently in your clinical informatics folder, i think)                                                                            

var casper = require('casper').create({
    //verbose: true,
    logLevel: 'debug',
    pageSettings: {
        //loadImages: false, // The WebPage instance used by Casper will                                                                                                                              
        //loadPlugins: false, // use these settings                                                                                                                                                    
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4'
    }
});

var utils = require('utils');

var x = require('casper').selectXPath;

casper.start("http://www.google.com/finance");

var search = casper.cli.args[0];//casper.cli.args.join(" ");
var current_date = new Date(casper.cli.args.slice(1).join(" "));

casper.then(function() {
    this.sendKeys(x("//*[@id='gbqfq']"), search)
});


casper.thenClick(x("//*[@id='gbqfb']"), function() {
    //console.log("clicking the accept button")
});

//*[@id="gbqfb"]/span

casper.wait(2000, function() {
    //console.log("taking a picture")
    //casper.capture('google1.png');
});



casper.thenClick(x("//*[@id='news-sidebar-footer']/div[1]/a"), function() {
    //console.log("clicking the accept button")
});

casper.wait(2000, function() {
    //console.log("taking a picture")
    //casper.capture('google2.png');
});


casper.wait(1000, function() {
    ////console.log("taking a picture")
    ////casper.capture('google2.png');
    for (var i = 1; i < 10; i++) {
    var d = this.getHTML(x("//*[@id='news-main']/div["+ i + "]/div[1]/span[2]"));
    console.log(d)
    var body = casper.evaluate(function(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        },
        this.getHTML(x("//*[@id='news-main']")));
    var date = d.split(" ") 
    if(date[1]=="hours" && date[2]=="ago")
    {
        console.log("few hours ago")
        //console.log("current date is", current_date)
    }
    else
    {
        var obj_date = new Date(d)
        if (obj_date.getDate() == current_date.getDate())
        {
            console.log("same date")
        }
        else
        {
            var diff = Math.abs(current_date-obj_date)/86400000;
            console.log(diff);
        }
    }
    //console.log(body); ////*[@id='main-content']
    }
});

casper.wait(1000, function() {
    //This is where you put the next set of code
    // see note in evernote
    //You should use similar code as finding the dates up above to get the link
    //when you have the link you can use the code from evernote+ your infoSAGE project to get the 
    //html from each of those links
    //then you can figure out which one has the longest text within the link and get that text for 
    //your machine learning
    
    //above when you find out a date is recent you should save the link
    //then here you can go get the link html
}

/**
casper.wait(1000, function() {
    ////console.log("taking a picture")
    ////casper.capture('google2.png');
    var body = casper.evaluate(function(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        },
        this.getHTML(x("//*[@id='news-main']")));
    console.log(body); ////*[@id='main-content']
});
**/

/**casper.thenClick(x("//*[@id='rso']/div[2]/li[1]/div/h3/a"), function() {
    //console.log("clicking the accept button")
});


casper.wait(1000, function() {
    //console.log("taking a picture")
    //casper.capture('google2.png');
    var body = casper.evaluate(function(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        },
        this.getHTML(x("/html/body")));
    var clean_body = body.substring(body.search(search))
    console.log(clean_body); ////*[@id='main-content']
});**/



/**
casper.evaluate(function(username, password) {
    document.querySelector('#username').value = username;
    document.querySelector('#password').value = password;
    document.querySelector('#submit').click();
}, 'sheldon.cooper', 'b4z1ng4');
**/

/**
casper.thenClick(x("//*[@id='fh-tabs']/li[2]/a/span"), function() {
    //console.log("clicking the accept button")
});

casper.wait(1000, function() {
    //console.log("taking a picture")
    //casper.capture('snomed3.png');
});


casper.then(function()
{
    content = casper.cli.args.join(" ")
    this.sendKeys(x("//*[@id='fh-search_canvas-searchBox']"), content)
})

casper.wait(1000, function() {
        //console.log("taking a picture")
        //casper.capture('snomed4.png');
});

casper.thenClick(x("//*[@id='fh-search_canvas-resultsTable']/tr[1]/td[1]/div/a"), function() {
    //console.log("clicking the first item in search")
});

casper.wait(1000, function() {
        //console.log("taking a picture")
        //casper.capture('snomed5.png');
        console.log(this.getHTML(x("//*[@id='home-attributes-fh-cd1_canvas']/h5")));
});
**/


casper.run();