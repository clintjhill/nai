var http = require('http'),
	apricot = require('apricot').Apricot,
	Futures = require('futures'),
	proxySource = {
		host: "localhost",
		port: "80"
	},
	regularExpressions = {
		ajax: /request\((\s*)\)/
	};

// HTTP request processor
var nai = {
	re: regularExpressions,
	
	request: function(url, func) {
		console.log("nai processing: " + url);
		http.get(
			nai.proxy(url), 
			function(res){ res.on('data', func); }
		).on(
			'error', 
			function(e){ console.log(e); }
		);
	},
	
	proxy: function(url) {
		proxySource["path"] = url;
		return proxySource;
	},
		
	appendToBody: function(body, url) { 
		return function(chunk) {
			return body += "<script type='text/javascript'>" + chunk + "</script>";
		}
	},
	
	headers: function(req) {
		req.headers['nai-intercepted'] = 'nai-baby';
		return req.headers;
	}, 
	
	parse: function(body) {
		var scripts = [];
		var urls = [];
		apricot.parse(body, function(err, doc){
			doc.find("script");
			doc.each(function(script){
				console.log(script.innerHTML);
			});
		});
		return urls;
	}
};

module.exports = nai;