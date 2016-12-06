const async = require('async');
const xlsx = require('node-xlsx');
const path = require('path');
const getwebdata = require('./getwebdata.js');

module.exports = function(file,url,callback) {
	var obj = xlsx.parse(file),result = {},arr = [];
	async.waterfall([
	    //获取excel中的数据
		function(callback) {
			obj.forEach(function(item) {
				var data = [];
				for(var i in item.data) {
					var value = item.data[i][0];
					if(value){
						data.push(value);
					}
				}
				result[item.name] = data;
			});
			for(var keys in result) {
				arr.push(result[keys]);
			}
			callback(null, arr);
		},
		//请求服务器并获取数据
		function(result,callback) {
			async.mapLimit(result,5, function(item, callback) {
				getwebdata(url, item, function(err, result) {
					if(err) callback(err, null);
					console.log(result);
					callback(null, result);
				});
			},function(err,result){
				if(err) callback(err, null);
				callback(null, result);
			});
		}
	],function(err,result){
		if(err) console.error(err);
		return callback(null, result);
	})

}