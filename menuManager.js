var fs = require('fs'),
path = require('path'),
_ = require('underscore');
var csv = require("fast-csv");

exports.menu=function (callback){
	menu={};
	IN_file="menu/27-abril.csv";
	rownum=0;
	proovedor=""
	csv
	 .parseFile(IN_file,{ delimiter:','})
	 .on("data", function(data){
	 	rownum+=1;
	 	data.push(rownum);

	 	if(rownum==1){}
	 	else{
	 		proovedor=data[5];
	 		
	 		
	 		if(!menu[proovedor]){
	 			menu[proovedor]=[];
	 		}
	 		menu[proovedor].push(data);
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