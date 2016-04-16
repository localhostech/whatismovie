var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser')

var app = express();

app.set('view engine', 'jade');
app.set('views', './views');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

//Middleware
require('./routes')(app);

//Create http server
var server = http.createServer(app);
server.listen(80, function() {
	console.log('Server is listening on port 80');
});