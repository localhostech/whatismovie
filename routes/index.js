var http = require('http');
var https = require('https');
var imdb = require('imdb');
var omdb = require('omdb');
var async = require('async');

module.exports = function(app) {
  	app.get('/', function(req, res) {
  		res.render('index');
  		https.request({
			host: 'translate.yandex.net',
		    path: '/api/v1.5/tr.json/translate?key=trnsl.1.1.20160413T124120Z.e19d21dac02023ad.8e35e97a83d275f328dff1b46e07ec4e6614e40d&text=мальчик&lang=ru-en'
		}, function(data) {
  			//console.log(data)
  		}).end();
  	});
  	app.post('/', function(req, res) {
  		req.str = res.locals.str = null;
  		//console.log(req.body.text);
		var translateopt = {
			host: 'translate.yandex.net',
		    path: '/api/v1.5/tr.json/translate?key=trnsl.1.1.20160413T124120Z.e19d21dac02023ad.8e35e97a83d275f328dff1b46e07ec4e6614e40d&text=' + encodeURI(req.body.text) + '&lang=ru-en'
		}
		
		var trnscallback = function(response) {
			enstr = '';
			
						response.on('data', function (chunk) {
							//console.log(chunk);
		      enstr += chunk;
		    });
		    response.on('end', function () {
		      enstr = JSON.parse(enstr);
		      console.log(enstr.text[0])
		      var options = {
		    	host: 'api.whatismymovie.com',
		    	path: '/1.0/?api_key=7q6KqMmV33JZWsdq&text=' + encodeURI(enstr.text[0])
				};
				http.request(options, callback).end();
		    });
			
		}
		callback = function(response) {
	    var str = '';
	    response.on('data', function (chunk) {
	      str += chunk;

	      req.str = res.locals.str = str;
	    });
	    response.on('end', function () {
	      console.log(str);
	      req.str = res.locals.str = str;
	      var movie;
	      var p = 0;
	      str = JSON.parse(str);
	      var howmuch = Object.keys(str).length;
	      console.log(howmuch);
	      var imdbarr = [];
		  async.forEach(Object.keys(str), function(key, callback) {
			    omdb.get({ imdb: str[key].imdb_id_long }, true, function(err, movie) {
				    if(err) {
				        return console.error(err);
				    }
				 	
				    if(!movie) {
				        return console.log('Movie not found!');
				    }
				 	
				    console.log('%s (%d)', movie.title, movie.year);
				    imdbarr[key] = movie;
				    callback();
				});
			}, function(err) {
			    if (err) {
			    	console.log(err);
			    }
			    console.log('Done!');
			    res.send({str:str, imdb:imdbarr});
			});
	  });
  	};
  	https.request(translateopt, trnscallback).end();
});
}