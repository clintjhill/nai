// core variable declarations
var http = require('http'),
	nai = require('./lib/nai');

http.createServer(function(req, res){
	// add nai headers for tracing purposes
	res.writeHead(200, nai.headers(req));
	// proxy to original source and end response
	nai.request(req.url, undefined, res);
}).listen(3001, "localhost");

console.log("started nai on 3001");
