const async = require('async');
const xlsx = require('node-xlsx');
const path = require('path');
const getwebdata = require('./getwebdata.js');

module.exports = function(name, req, file, url, callback) {
	//获取excel中的数据
	var obj = xlsx.parse(file),
		result = {},
		arr = [],
		allnum = 0,
		donenum = 0;
	obj.forEach(function(item) {
		var data = [];
		for(var i in item.data) {
			var value = item.data[i][0];
			if(value) {
				data.push(value);
			}
		}
		result[item.name] = data;
		allnum = allnum + data.length;
	});
	for(var keys in result) {
		arr.push(result[keys]);
	}
//	获取excel数据arr
	async.mapSeries(arr, function(items, callback) {
		async.mapLimit(items, 2, function(item, callback) {
			getwebdata(url, item, function(err, result) {
				if(err)return callback(err, null);
				req.session[name] = Math.floor(++donenum / allnum * 100);
				req.session.save();
				return callback(null, result);
			});
		}, function(err, result) {
			if(err)return callback(err, null);
			return callback(null, result);
		});

	}, function(err, result) {
		if(err)return callback(err, null);
		return callback(null, result);
	});

}