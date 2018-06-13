// Load the http module to create an http server.
var http = require('http'); 
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var path = require('path');
var redis = require('redis');

var fFuncs = require('./fileFuncs.js');

//basic___variables________
var todoItems = [];
var i, j;
//end__variables___

let client = redis.createClient();

client.on('connect', function(){
	
	getDataFromRedis();
	console.log('Connected to redis');
});

// Create a function to handle every HTTP request
function handler(req, res){
	
	if (req.method == 'POST') {
        var body = '';
		
		req.on('error', function () {
			console.error();
		}).on('data', function(data){
            body += data;
	
        }).on('end', function(){
			todoItems = [];
			
			todoItems = JSON.parse(body);
			
			storeDataInRedis();
		});
	}else if(req.method === 'GET'&& req.url == '/todoItems'){
		res.writeHead(200, { 'Content-Type': "text/plain" });
		
        res.end(JSON.stringify(todoItems), 'utf-8');
	}else if (req.method === 'GET'){
		getPage(req, res);
	}
	
}

extensionToContentType = {
		'.html': 'text/html',
		'.js': 'text/javascript',
		'.css': 'text/css',
		'.json': 'application/json',
		'.png': 'image/png',
		'.jpg': 'image/jpg',
		'.wav': 'audio/wav'
}



function storeDataInRedis(){
	var stringData = JSON.stringify(todoItems);

	client.set('user', stringData, function(err, reply){
		console.log("Data stored->");
		console.log(todoItems[todoItems.length - 1]);
	});
}

function getDataFromRedis(){
	client.get('user', function(err, reply){
		todoItems = JSON.parse(reply);
		console.log(todoItems);
	});
}

function getPage(req, res){

    var filePath = '.' + req.url;
    if (filePath === './')
        filePath = './index.html';

    var extname = path.extname(filePath);
    var contentType = extensionToContentType[extname] || 'text/plain';

    fs.readFile(filePath, 'utf-8', function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content);
                });
            }
            else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                res.end(); 
            }
        }
        else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}

//unused functions
function getDataFromFile(){
	fs.readFile("j.json", 'utf8', function (err, content) {
        if(err){
			console.error(err);
		}else{
			todoItems = JSON.parse(content);
		}
    });
}
// Create a server that invokes the `handler` function upon receiving a request
http.createServer(handler).listen(8000,function(err){
  if(err){
    console.log('Error starting http server');
  } else {
    console.log("Server running at http://127.0.0.1:8000/ or http://localhost:8000/");
  };
});