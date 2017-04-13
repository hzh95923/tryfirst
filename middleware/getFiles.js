const async = require('async');
const path = require('path');
const fs = require('fs');
module.exports=function (paths, callback) {

	fs.readdir(paths, function(err, files) {
		async.mapSeries(files, function(file, callback) {
			fs.stat(path.join(paths, file), function(err, stats) {
				if(stats.isDirectory()) {
					return callback(null, null);
				} else {
					return callback(null, file);
				}
			});
		}, function(err, result) {
			if(err) return console.log(err);
			for(var i = result.length - 1; i > 0; i--) {			
				if(result[i] == undefined) {
					result.splice(i, 1);
				}
			}
			return callback(result);
		});
	});
}