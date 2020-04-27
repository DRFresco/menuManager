var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var Crawler = require("crawler");
//          (_    ,_,    _) 
//          / `'--) (--'` \
//         /  _,-'\_/'-,_  \
//        /.-'     "     '-.\
//         Julia Orion Smith

app.use(bodyParser.json())
var fs = require("fs");
var path = require('path');
var menuManager = require('./menuManager');
//console.log("public",__dirname + '/sitio')
app.use('/', express.static(__dirname + '/sitio'));
app.use('/ordenes/', express.static(__dirname + '/ordenes'));




//ORDENES

//MENÚ
app.get('/menu', function (req, res) {
	menuManager.menu(function(menuR){
		res.json(menuR);
		//console.log(menuR);
	});

});

//SITIO PRINCIPAL
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/sitio/index.html'));

});
//TEST
app.get('/hello', function (req, res) {
  res.sendFile(path.join(__dirname + '/sitio/staticindex.html'));
});
app.post('/orden', function (req, res) {
  console.log(req.body);
  fs.writeFile("ordenes/orden.json",JSON.stringify(req.body) , function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    console.log("Orden procesada");
	}); 
  res.send("109987")
});


//PUERTO


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});