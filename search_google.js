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

var search = casper.cli.args.join(" ");

casper.then(function() {
    this.sendKeys(x("//*[@id='gbqfq']"), search)
});

casper.thenClick(x("//*[@id='gbqfsa']"), function() {
    //console.log("clicking the accept button")
});

//*[@id="gbqfb"]/span

casper.wait(2000, function() {
    //console.log("taking a picture")
    casper.capture('google1.png');
});


casper.thenClick(x("//*[@id='rso']/div[2]/li[1]/div/h3/a"), function() {
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
});



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