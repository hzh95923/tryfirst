const router = require('express').Router();
const async = require('async');
const path = require('path');
const fs = require('fs');
const upLoadDir = require('config-lite').upLoadDir;
const getDataToObject = require(path.join(process.cwd(), '/middleware/getData')).ToObject;


router.get(/^(?!.*(images))/, function(req, res, next) {
	var paths = path.join(process.cwd(), '/views', req.baseUrl, req.path + '.ejs');
	var arr = req.path.split('/');
	var lang = arr[arr.length - 1];
	arr.splice(3,2);
	var dir = arr.join('/');
	var myexcel = path.join(process.cwd(), upLoadDir, dir, req.query.excel + '.xlsx');
	async.waterfall([
			//读取excel中的数据
			function(callback) {
				getDataToObject(myexcel, lang, function(err, result) {
					if(err) return console.log("读取excel中的数据失败");
					callback(null, { 'data': result });
				});
			}
		],
		function(err, data) {
			if(err) return console.log(err);
			fs.access(paths, fs.constants.R_OK | fs.constants.W_OK, (err) => {
				if(err) {
					next();
				} else {
					res.render((req.baseUrl + req.path).slice(1), data);
				}
			});
		});
});
module.exports = router;