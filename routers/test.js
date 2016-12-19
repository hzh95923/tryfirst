const router = require('express').Router();
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
const getwebdata = require('../middleware/getwebdata.js');
const xlsx = require('node-xlsx');
const async = require('async');

module.exports = function(io) {
	router.get('/', function(req, res) {
		res.locals.title='测试页面';
		res.render('test');
		
	});
	router.post('/', function(req, res) {
		var form = new formidable.IncomingForm();
		form.uploadDir = "./public/upload";
		form.parse(req, function(err, fields, files) {
			if(files.upfiles.name) {
				var name = files.upfiles.name;
				var oldpath = path.join(__dirname + '/../' + files.upfiles.path);
				var newpath = path.join(__dirname + '/../' + form.uploadDir + '/' + name);

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
						var obj = xlsx.parse(newpath),
							result = {},
							arr = [],
							allnum = 0;
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
						callback(null, {'arr':arr,'allnum':allnum});
					},
					//	异步请求网站抓取数据
					function(data, callback) {
						var donenum = 0;
						async.mapSeries(data.arr, function(items, callback) {
							async.mapLimit(items, 2, function(item, callback) {
								getwebdata('http://192.168.116.9:8080/dm_com_web/productsearch.html', item, function(err, result) {
									if(err) return callback(err, null);
									req.session.doneprogress = Math.floor(++donenum / data.allnum * 100);
									req.session.save();
									io.sockets.emit('dataToUser', req.session.doneprogress);
									return callback(null, result);
								});
							}, function(err, result) {
								if(err) return callback(err, null);
								return callback(null, result);
							});

						}, function(err, result) {
							if(err) return callback(err, null);
							return callback(null,result);
						});
					}
				], function(err, data) {
					if(err) return console.log(err);
					return res.json(result);
				});
			} else {
				return res.json('未上传文件');
			}
		});
	});
	return router;
}