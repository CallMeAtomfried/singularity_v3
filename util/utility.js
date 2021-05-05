const fs = require("fs");
module.exports = class Utility {
	constructor(){};
	
	getDirectories(path) {
		return fs.readdirSync(path).filter(function (file) {
			return fs.statSync(path+'/'+file).isDirectory();
		});
	}
	
	splitter(stringIn) {
		if(stringIn.length < 2000) return [stringIn];
		var strarray = stringIn.split("\n");
		
		var output = []
		var n = 0;
		var q = 0;
		
		for(var x in strarray) {
			while(`${output[n]}${strarray[q]}\n`.length < 2000 && q < strarray.length) {
				if(output[n] == undefined) output[n] = "";
				output[n] += `${strarray[q]}\n`
				q++;
			}
			
			n++;
		}
		return(output);
	}
	
	range(a, b) {
		if(!b) {
			b = a;
			a = 0;
		}
		if(a<b) {
			var y = a;
			a = b;
			b = y;
		}
		var arr = [];
		for(var x = 0; x < b-a; x++) {
			arr[x] = x-a;
		}
		return arr;
	}
}