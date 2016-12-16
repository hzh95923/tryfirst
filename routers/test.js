const router = require('express').Router();
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
const getwebdata = require('../middleware/getwebdata.js');
const xlsx = require('node-xlsx');
const async = require('async');

module.exports = function(io) {
	router.get('/', function(req, res) {
		res.render('test', {
			'title': "测试页面"
		});
	});
	router.post('/', function(req, res) {
		var form = new formidable.IncomingForm();
		form.uploadDir = "./public/upload";
		form.parse(req, function(err, fields, files) {
			if(files.upfiles.name) {
				var name = files.upfiles.name;
				//执行改名
				var oldpath = path.join(__dirname + '/../' + files.upfiles.path);
				var newpath = path.join(__dirname + '/../' + form.uploadDir + '/' + name);
				fs.rename(oldpath, newpath, function(err) {
					if(err) return console.log("改名失败");
					var obj = xlsx.parse(newpath),
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
					//	异步请求网站抓取数据
					async.mapSeries(arr, function(items, callback) {
						async.mapLimit(items, 2, function(item, callback) {
							getwebdata('http://192.168.116.9:8080/dm_com_web/productsearch.html', item, function(err, result) {
								if(err) return callback(err, null);
								req.session.doneprogress = Math.floor(++donenum / allnum * 100);
								req.session.save();
								io.sockets.emit('dataToUser', req.session.doneprogress);
								return callback(null, result);
							});
						}, function(err, result) {
							if(err) return callback(err, null);
							return callback(null, result);
						});

					}, function(err, result) {
						if(err) return console.log(err);
						return res.json(result);
					});
				});
			} else {
				return res.json('未上传文件');
			}
		});
	});
	return router;
}