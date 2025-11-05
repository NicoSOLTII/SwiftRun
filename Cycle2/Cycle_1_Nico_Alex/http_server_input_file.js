/*
	http_server_input_file.js   2022-10-12
	
	This server will display the content of html file 
	http default port number is 80
*/

// mime module is required for testing different file types
var mime = require('mime');

// http module is required to create a web server
var http = require('http');

// fs module is required to read file from file system
var fs = require('fs');

// url module is required to parse the URL
var url = require('url');
// path module for safe path handling
var path = require('path');


// create the server here...

http.createServer(function (request, response) {

	// parse the incoming request's url, which is an object containing path and file name
	var pathname = url.parse(request.url).pathname;

	// default to the project's main page when requesting '/'
	var requested = pathname === '/' || pathname === '' ? 'com3105_project.html' : pathname.substr(1);

	// decode URI components (handles spaces and encoded characters)
	try {
		requested = decodeURIComponent(requested);
	} catch (e) {
		console.log('Failed to decode URI component, using raw path');
	}

	// prevent directory traversal and resolve to absolute path inside this folder
	var safePath = path.normalize(requested).replace(/^\.+(\/|\\)/, '');
	var fullPath = path.join(__dirname, safePath);

	console.log('Requested path:', requested);
	console.log('Serving file:', fullPath);

	// read the requested file content from file system
	fs.readFile(fullPath, function (err, data) {

		if (err) {
			console.log('Error: open input file!');
			// HTTP status: 404 : NOT FOUND
			response.writeHead(404, {'Content-Type' : 'text/html'});
			response.write('Error: reading input file');
		} else {


			// HTTP status: 200 : OK, also use different file type base on MIME
			var contentType = mime.getType(fullPath) || 'application/octet-stream';
			response.writeHead(200, {'Content-Type' : contentType});

			// write the content of the file to response body
			response.write(data);

		}

		// send the response body
		response.end();
	});

}).listen(80);


console.log('Server running at http://localhost/com3105_project.html or http://127.0.0.1:80/com3105_project.html');

console.log('Server Program Ended.');