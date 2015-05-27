
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

casper.start("http://www.nlm.nih.gov/medlineplus/mplusdictionary.html");

casper.thenClick(x("//*[@id='block-block-47']/div/div/div/a"),
    function() {
        casper.wait(1000, function() {
            //casper.capture("UTD1.png")
        });
    }
);

casper.then(
    function() {
        //console.log('entering username...');
        casper.sendKeys(x("//*[@id='userName']"), 'abish125');
        //casper.click('x(input[@name="password"])');
        casper.sendKeys(x("//*[@id='password']"), 'Tike125349');
    });

casper.wait(1000, function() {
    //casper.capture("UTD2.png")
});


casper.thenClick(x("//*[@id='btnLoginSubmit']"), function() {
    //console.log('logging in');
});

casper.wait(1000, function() {
    //console.log("waiting to load");
    //casper.capture('UTD3.png');
});

casper.then(function() {
    this.sendKeys(x("//*[@id='txtSearch']"), search)
    this.click(x("//*[@id='searchbox_dd_submit']"))
});

casper.wait(1000, function() {
    //console.log("waiting to load");
    //casper.capture('UTD4.png');
});

casper.thenClick('#resultList li.normalResult:nth-child(3) div.indSearchResult a', function ()
{
    //console.log('going to first link')
});

casper.wait(1000, function()
    {
        //console.log("getting search results");
        //casper.capture('UTD5.png');
    });

casper.wait(1000, function() {
    ////console.log("taking a picture")
    ////casper.capture('google2.png');
    var body = casper.evaluate(function(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        },
        this.getHTML(x("//*[@id='topicText']")));
    console.log(body); ////*[@id='main-content']
});

casper.run();