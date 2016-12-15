const router = require('express').Router();
const path = require('path');
const excel2webdata = require('../middleware/excel2webdata.js');
const formidable = require('formidable');
const fs = require('fs');

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
					if(err) {
						return console.log("改名失败");
					}
					excel2webdata('doneprogress', req, newpath, 'http://192.168.116.9:8080/dm_com_web/productsearch.html', function(err, result) {
						if(err) return console.log(err);
						return res.json(result);
					});

				});
			} else {
				return res.json('未上传文件');
			}
		});
		(function returnprogress(argu) {
			if(!req.session.doneprogress||argu) {
				req.session.doneprogress = 0;
			}
			io.sockets.emit('dataToUser', req.session.doneprogress);
			if(!req.session.doneprogress || req.session.doneprogress < 100) {
				setTimeout(returnprogress, 1000);
			}
		})(1);

	});

	return router;
}