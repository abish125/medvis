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

var search = casper.cli.args.join(" ");

casper.start("http://www.wikipedia.org/");

casper.then(
    function() {
        //console.log('entering username...');
        casper.sendKeys(x("//*[@id='searchInput']"), search);
    });

casper.wait(1000, function() {
    //console.log("waiting to load");
    casper.capture('wikipedia1.png');
});

casper.thenClick(x("//*[@id='search-form']/fieldset/button"), function() {
    //console.log('logging in');
});

/**
casper.thenClick(x("//*[@class='formBtn']"), function() {
    //console.log('logging in');
});
**/

casper.wait(1000, function() {
    //console.log("waiting to load");
    casper.capture('wikipedia2.png');
});



casper.wait(1000, function() {
    ////console.log("taking a picture")
    ////casper.capture('google2.png');
    var body = casper.evaluate(function(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        },
        this.getHTML(x("//*[@id='mw-content-text']/p[1]")));
    console.log(body); ////*[@id='main-content']
});

casper.run();