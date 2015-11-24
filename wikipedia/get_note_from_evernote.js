//use the google search casperjs thing that you got from subelsky or whoever (currently in your clinical informatics folder, i think)                                                                            

var casper = require('casper').create({
    //verbose: true,
    //logLevel: 'debug',
    pageSettings: {
        //loadImages: false, // The WebPage instance used by Casper will                                                                                                                              
        //loadPlugins: false, // use these settings                                                                                                                                                    
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4'
    }
});

var utils = require('utils');

var x = require('casper').selectXPath;

var search = casper.cli.args.join(" ");

casper.start("https://www.evernote.com/shard/s551/nl/108170115/3944ba5b-113f-488a-b076-d38128b6eb63/");

casper.then(
    function() {
        //console.log('entering username...');
        casper.sendKeys(x("//*[@id='username']"), "abish125@gmail.com");
    });

casper.wait(5000, function() {
    casper.sendKeys(x("//*[@id='password']"), "tike125349");
    //console.log("waiting to load");
});

casper.thenClick(x("//*[@id='login']"), function() {
    //console.log('logging in');
});

casper.wait(5000, function() {
});

casper.thenClick(x("//*[@id='lightbox-close']"), function() {
    //console.log('logging in');
});

casper.wait(5000, function() {
    //console.log("waiting to load");
    casper.capture('evernote.png');
});

casper.then(function ()
        {
            this.page.switchToChildFrame(0);
            
            //this.page.switchToParentFrame();
        });


casper.wait(1000, function() {
    ////console.log("taking a picture")
    ////casper.capture('google2.png');
    var body = casper.evaluate(function(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        },
        this.getHTML(x("//*[@id='note-frame-body']/div/div")));
    console.log(body); ////*[@id='main-content']
});

casper.run();