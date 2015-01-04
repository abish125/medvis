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

casper.start("http://www.google.com");

casper.wait(1000, function() {
    //console.log("waiting ")
});

casper.thenClick(x("//*[@id='license-modal']/div/div/div[3]/button/span"), function() {
	//console.log("clicking the accept button")
});

casper.wait(1000, function() {
	//console.log("taking a picture")
    //casper.capture('snomed1.png');
});

casper.thenClick(x("//*[@id='welcome-perspective']/div/p[4]/a[1]/span[1]"), function() {
	//console.log("clicking the accept button")
});

casper.wait(1000, function() {
	//console.log("taking a picture")
    //casper.capture('snomed2.png');
});

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



casper.run();