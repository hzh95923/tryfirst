const xlsx = require('node-xlsx');

exports.ToObject = function(file, lang, callback) {
	//获取excel中的数据
	var obj = xlsx.parse(file),
		result = {};
	obj.forEach(function(item) {
		var resultarr = [];
		for(var i in item.data) {
			var data = {};
			
			if(item.data[i][0] == lang) {
				for(var j in item.data[i]) {
					data[item.data[0][j]] = item.data[i][j];
				}
				resultarr.push(data);
			}
		}
		result[item.name] = resultarr;
	});
	callback(null, result);
}
exports.ToArray = function(file, callback) {
	//获取excel中的数据
	var obj = xlsx.parse(file);
	callback(null, obj);
}
