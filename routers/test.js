const router = require('express').Router();
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
const async = require('async');
const getDataToObject = require('../middleware/getData').ToObject;
module.exports = function() {
	router.get('/', function(req, res) {
		res.locals.title = '测试页面';
		res.render('test');
	});
	router.post('/', function(req, res) {
		var form = new formidable.IncomingForm();
		form.uploadDir = "../nodeUpload/";
		form.parse(req, function(err, fields, files) {
			if(files.upfiles.name) {
				var name = files.upfiles.name;
				var oldpath = path.join(form.uploadDir, files.upfiles.path);
				var newpath = path.join(form.uploadDir, name);
				async.waterfall([
					//执行改名
					function(callback) {
						fs.rename(oldpath, newpath, function(err) {
							if(err) return console.log("改名失败");
							callback(null, null);
						});
					},
					//读取excel中的数据
					function(data, callback) {
						getDataToObject(newpath, function(err, result) {
							if(err) return console.log("读取excel中的数据失败");
							callback(null, { 'data': result });
						});
					}
				], function(err, data) {
					if(err) return console.log(err);
					return res.json(data);
				});
			} else {
				return res.json('未上传文件');
			}
		});
	});
	return router;
}