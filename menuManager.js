var fs = require('fs'),
path = require('path'),
_ = require('underscore');
var csv = require("fast-csv");

//          (_    ,_,    _) 
//          / `'--) (--'` \
//         /  _,-'\_/'-,_  \
//        /.-'     "     '-.\
//         Julia Orion Smith

exports.liveMenu={};
exports.cache=false;
exports.inicializa=function (){
	isCached=getMostRecentFileName("menu/workingcopy");
	if(isCached!="menu.json"){
		console.log("no cache")
	}
	else{
		console.log(isCached)
		fs.readFile('menu/workingcopy/'+isCached, 'utf8', (err, jsonString) => {
		    if (err) {
		        console.log("Error reading file from disk:", err)
		        return
		    }
		    try {
		        this.liveMenu=JSON.parse(jsonString);
		        this.cache=true;
		        //console.log(this.liveMenu);
		} catch(err) {
		        console.log('Error parsing JSON string:', err)
		    }
		})
		

	}
	

}
exports.updateCache=function (cache){
	const jsonString = JSON.stringify(cache);
	fs.writeFile('menu/workingcopy/menu.json', jsonString, err => {
	    if (err) {
	        console.log('Error: writing file failed', err)
	    } else {
	        console.log('Successfully wrote cache')
	    }
	})
}
exports.menu=function (callback){
	menu={};
	IN_file="menu/27-abril.csv";
	rownum=0;
	proovedor="";
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
	 	this.liveMenu=menu;
	 	//console.log(this.liveMenu)
	 	callback(this.liveMenu);
	 })
}
exports.actualiza=function (orden,callback){

	//console.log(this.liveMenu); //[key][1]=cantidad, [key][2]=precio, key0=names
	for(key in orden){
		nom=orden[key][0];

		productoProductor=nom.split("[|]");
		productor_list=[];
		discounted=0;

		if( Number.parseFloat( orden[key][1] ) > 0 ){

			//console.log(productoProductor,orden[key][1])
			//productor_list=this.liveMenu[ 'EL RENACER DEL CAMPO ( @elrenacerdelcampo)' ]
			productor_list=this.liveMenu[ productoProductor[1] ]


			for(i=0;i<productor_list.length;i++){
				if(productoProductor[0]==productor_list[i][0]){
					//ACTUALIZA INVENTARIO EN LIVE MENU
					//console.log("Before",this.liveMenu[ productoProductor[1] ]);
					discounted=Number.parseFloat(this.liveMenu[ productoProductor[1] ][ i ][3])-
					Number.parseFloat(orden[key][1]);
					this.liveMenu[ productoProductor[1] ][ i ][3]=discounted;
					//console.log("After",this.liveMenu[ productoProductor[1] ][ i ][3]);

				}
			}
			
		}
		
	}
	callback();
}






function getMostRecentFileName(dir) {
    var files = fs.readdirSync(dir);

    // use underscore for max()
    return _.max(files, function (f) {
        var fullpath = path.join(dir, f);

        // ctime = creation time is used
        // replace with mtime for modification time
        return fs.statSync(fullpath).mtime;
    });
}