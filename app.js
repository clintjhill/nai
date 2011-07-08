// core variable declarations
var http = require('http'),
	nai = require('./lib/nai');

http.createServer(function(req, res){
	// add nai headers for tracing purposes
	res.writeHead(200, nai.headers(req));
	// get initial HTML to parse script tags
	nai.request(
		req.url, 
		function(body){
			var urls = nai.parse(body);
			res.end(body);
		}
	);

}).listen(3001, "localhost");

console.log("started nai on 3001");
