//phantomjs
var page = require('webpage').create();
var url = 'google.com';
 
page.open(url, function (status) {
    var js = page.evaluate(function () {
        return document;
    });
    console.log(JSON.stringify(js)); 
    phantom.exit();
});
 
 
 
 
//casperjs
var casper = require('casper').create();
var url = 'http://instagram.com/';
 
casper.start(url, function() {
    var js = this.evaluate(function() {
		return document; 
	});	
    this.echo(JSON.stringify(js)); 
});
casper.run();