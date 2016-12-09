const async = require('async');
const xlsx = require('node-xlsx');
const path = require('path');
const getwebdata = require('./getwebdata.js');

module.exports = function(file, url, callback) {
	//获取excel中的数据
	var obj = xlsx.parse(file),
		result = {},
		arr = [];
	obj.forEach(function(item) {
		var data = [];
		for(var i in item.data) {
			var value = item.data[i][0];
			if(value) {
				data.push(value);
			}
		}
		result[item.name] = data;
	});
	for(var keys in result) {
		arr.push(result[keys]);
	}

	async.mapSeries(arr, function(item, callback) {
		getwebdata(url, item, function(err, result) {
			if(err) callback(err, null);
			callback(null, result);
		}); 
	}, function(err, result) {
		if(err) callback(err, null);
		callback(null, result);
	});

}