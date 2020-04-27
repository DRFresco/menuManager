var fs = require('fs'),
path = require('path'),
_ = require('underscore');
var csv = require("fast-csv");

exports.menu=function (callback){
	menu={};
	IN_file="menu/menuprueba.csv";
	rownum=0;
	proovedor=""
	csv
	 .parseFile(IN_file,{ delimiter:','})
	 .on("data", function(data){
	 	rownum+=1;
	 	data.push(rownum);
	 	if(rownum==1){}
	 	else{
	 		if(data[2]==data[3]){
	 			proovedor=data[0];
	 			console.log(proovedor)
	 			if(!menu[proovedor]){
	 				menu[proovedor]=[];
	 			}
	 			
	 		}
	 		else{
	 			if(!menu[proovedor]){
	 				menu[proovedor]=[];
	 			}
	 			menu[proovedor].push(data);
	 			//menu=data+"\n";
	 		}
	 	}
	 		 	
	 })	
	 .on("end", function(){
	 	
	 	callback(menu);
	 })
}






 function getMostRecentFileName(dir) {
    var files = fs.readdirSync(dir);

    // use underscore for max()
    return _.max(files, function (f) {
        var fullpath = path.join(dir, f);

        // ctime = creation time is used
        // replace with mtime for modification time
        return fs.statSync(fullpath).ctime;
    });
}