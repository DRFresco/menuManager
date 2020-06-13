var express = require('express');
var app = express();
var bodyParser = require('body-parser')
const dotenv = require('dotenv');
dotenv.config();
var Crawler = require("crawler");
var async = require("async");
var pdf = require('html-pdf');
const multer = require('multer');
const csv = require('fast-csv');
_ = require('underscore');

//          (_    ,_,    _) 
//          / `'--) (--'` \
//         /  _,-'\_/'-,_  \
//        /.-'     "     '-.\
//         Julia Orion Smith

app.use(bodyParser.json())
var fs = require("fs");
var path = require('path');
var menuManager = require('./menuManager');
var printingSystem = require('./printingSystem');
//console.log("public",__dirname + '/sitio')
app.use('/', express.static(__dirname + '/sitio'));
app.use('/ordenes/', express.static(__dirname + '/ordenes'));
app.use('/archivo/', express.static(__dirname + '/archivo'));


menuManager.inicializa();

//ORDENES
app.post('/orden', function (req, res) {
  //console.log(req.body);
  name=req.body["nombre"].substring(0,4)+"__"+Math.floor(Math.random() * 100)+Math.floor(Date.now() / 60000);
  fs.writeFile("ordenes/"+name+".json",JSON.stringify(req.body) , function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    else{
	    	menuManager.actualiza(req.body.orden,function(){
	    		menuManager.updateCache(menuManager.liveMenu);
	    	});
	    	console.log("Orden "+name+" procesada");
	    	//return name;
	    	res.json({"orden":name});
	    }
	    
	}); 
  
});
app.post('/ordenview', function (req, res) {
  //console.log(req.body);
  nombreorden=req.body["nombre"];
  menuManager.getOrden(nombreorden, function(orden){
  		res.json(orden);
  });
});
app.get('/ordenes', function (req, res) {
  menuManager.getOrdenes(function(ordenes){
  		res.send(ordenes);
		console.log("corte de caja...");
  });
});
app.get('/ordenaOrdenes', function (req, res) {

  menuManager.ordenaOrdenes(function(ordenes){
  		res.send(ordenes);
		console.log("corte de caja...");
  });
});
//MENÚ
app.get('/menu', function (req, res) {
	if( !isEmpty(menuManager.liveMenu) ){
		//console.log("live");
		res.json(menuManager.liveMenu);
	}
	else{
		menuManager.menu(function(menuR){
			menuManager.updateCache(menuR);
			res.json(menuR);
			console.log("initializing...");
		});
	}
	

});

//SITIO PRINCIPAL
app.get('/', function (req, res) {
	console.log("--")
	res.sendFile(path.join(__dirname + '/sitio/menu.html'));

});
app.get('/orden', function (req, res) {
	res.sendFile(path.join(__dirname + '/sitio/orderview.html'));

});
app.get('/uploadmenu', function (req, res) {
	res.sendFile(path.join(__dirname + '/sitio/uploadmenu.html'));

});
//TEST
app.get('/hello', function (req, res) {
  res.sendFile(path.join(__dirname + '/sitio/staticindex.html'));
});
//ADMIN
app.get('/adminPrint', function (req, res) {
	thistime="";
	bandeja={};
	printed=0;
	var options = { format: 'A4' };
	printingSystem.print(function(htmls){
		fs.readdir("bandeja", function (err, files) {
			 admin={};
			 //thistime="";
			 header="";
			  if (err) {
		        console.error("Error stating file.", error);
		        return;
		      }
		      files.forEach(function (file, index) {

		      		name=file.replace(".pdf","");
		      		
			      	if(!file.includes(".DS")){
			      		bandeja[name]=1;
			      		console.log(name," ya procesado");
			      	}
			      	
		     });
			for(key in htmls){
				if(!bandeja[key] && printed<1){
					printed++;
					    pdf.create(htmls[key],{ format: 'Letter' }).toFile('./bandeja/'+key+'.pdf', function(err, res) {
							if (err){console.log(err);} else {console.log(res);}
						});
				}
		      
			}
		  //     pdf.create(thistime).toFile('./bandeja/'+thistime+'.pdf', function(err, res) {
				// if (err){console.log(err);} else {console.log(res);}
			 //  });
		});
	});
});

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
// MENU UPLOAD
const upload = multer({ dest: 'menu/csv/' });
app.post('/uploadmenu', upload.single('file'), function (req, res) {
	console.log("ok");
	const fileRows = [];
  csv.parseFile(req.file.path)
    .on("data", function (data) {
      fileRows.push(data); // push each row
    })
    .on("end", function () {
      console.log(fileRows) //contains array of arrays. Each inner array represents row of the csv file, with each element of it a column
      fs.unlinkSync(req.file.path);   // remove temp file
      //process "fileRows" and respond
    })
});

//PUERTO
const port = process.env.PORT;
console.log(`Your port is ${port}`);

app.listen(3000, function () {
  console.log('Example app listening on port '+port+'!!!');
});


function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}