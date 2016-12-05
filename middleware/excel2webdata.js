const async = require('async');
const xlsx = require('node-xlsx');
const path = require('path');
const getwebdata = require('./getwebdata.js');
module.exports = function(file, callback) {
	var obj = xlsx.parse(file),
		result = {};
	async.waterfall([
		function(callback) {
			obj.forEach(function(item) {
				var data = [];
				for(var i in item.data) {
					var arr = [];
					var value = item.data[i];
					for(var j in value) {
						arr.push(value[j]);
					}
					data.push(arr);
				}
				result[item.name] = data;
			});
			callback(null, result);
		},
		function(result) {
			var arr = [];
			for(var [name, val] of Object.entries(result)) {
				arr.push(val);
			}
			async.mapSeries(arr, function(item, callback) {
				getwebdata('http://www.dressilyme.com/productsearch.html', item, function(err, result) {
					if(err) callback(err, null);
					callback(null, result);
				});
			},function(err,result){
				if(err) callback(err, null);
				callback(null, result);
			});
		}
	],function(err,result){
		if(err) console.err(err);
	})

}