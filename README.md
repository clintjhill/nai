# NAI
NodeJS Ajax Interceptor

NodeJS server that intercepts Web server HTTP requests and scrapes AJAX requests out of the HTML. Makes the AJAX requests and injects the responses into script tags at the bottom of the HTML body. 

This provides the initial request to a page to be as fast as possible by removing all of the subsequent AJAX calls during DOM readiness phase(s). This server however does require changes to your AJAX implementation. You will have to create a hook to check for these AJAX results before making the AJAX request. 


