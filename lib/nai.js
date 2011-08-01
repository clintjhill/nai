var http = require('http'),
	apricot = require('apricot').Apricot,
	Futures = require('futures');
	
	//TODO: Expose this as configuration externally
var proxySource = {
		host: "localhost",
		port: "80"
	};
	
	//TODO: Expose this as configuration externally
var regularExpressions = {
		ajax: /[\w\d\/]*.json/g // /\("([\w\d\/]*.json)",/
	};

var nai = {
	
	re: regularExpressions,
	
	/*
		Entry point function that takes a URL and function which will perform 
		the processing of the request. A response can be supplied instead of
		a function if this is the default request. 
		
		Example for originating request:
		nai.request("/", res); // http.ServerResponse object from NodeJS 
		
		Example for subsequent (ajax) request:
		nai.request("/", func); // can be nai.appendToBody function	
	*/
	request: function(url, func, res) {
		//TODO: make type check for function vs. http.ServerResponse obj.
		func = func || nai.defaultRequest(res);
		console.log("nai processing: " + url);
		// make the proxy request and process with func
		http.get(nai.proxy(url), function(r){ r.on('data', func); }
		//TODO: Finish res here to assure invisible failures
		).on('error', function(e){ console.log(e); } );
	},
	
	/*
		Proxy configuration object. Resets the path and returns.
	*/
	proxy: function(url) {
		proxySource["path"] = url;
		return proxySource;
	},
	
	defaultRequest: function(res) {
		return function(body){
			var urls = nai.parse(body);
			res.end(body);
		}
	},
	
	loadResponses: function(body, urls) {
		var i = urls.length;
		while(i--){
			body = nai.getResult(urls[i], body);
		}
		return body;
	},
	
	getResult: function(url, body){
		http.get(url, 
				function(r) { 
					r.on('data', function(res){
						return nai.appendToBody(body, url, res);
					})
				});
	},
		
	appendToBody: function(body, url, chunk) { 
		return body += "<script type='text/javascript'> var " + url + " = " + chunk + "</script>";
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
				if(script.text){
					var content = script.text.replace(/[\n\t\s]*/g,"");
					var match = content.match(nai.re.ajax);
					if(match){
						var i = match.length;
						while(i--){
							urls.push(match[i]);
						}
					}
				}
			});
		});
		return urls;
	}
};

module.exports = nai;