const router = require('express').Router();
const path = require('path');
const excel2webdata = require('../middleware/excel2webdata.js');
const formidable = require('formidable');
const fs = require('fs');

//router.get('/', function(req, res) {
//	excel2webdata(req,path.join('./public/upload' + '/test.xlsx'), 'http://192.168.116.9:8080/dm_com_web/productsearch.html', function(err, result) {
//		if(err) console.log(err);
//		return res.json(result);
//	});
//});
router.get('/', function(req, res) {
	res.render('test', {
		'title': "测试页面"
	});
});

router.post('/', function(req, res) {
	var form = new formidable.IncomingForm();
	form.uploadDir = "./public/upload";
	form.parse(req, function(err, fields, files) {
		var name = files.upfiles.name;
		//执行改名
		var oldpath = path.join(__dirname+'/../'+files.upfiles.path);
		var newpath = path.join(__dirname+'/../'+form.uploadDir+'/'+name);
		fs.rename(oldpath,newpath,function(err){
	        if(err){
	            console.log("改名失败");
	        }
			excel2webdata('upfiles',newpath, 'http://192.168.116.9:8080/dm_com_web/productsearch.html', function(err, result) {
				if(err) console.log(err);
				return res.json(result);
			});
			
       });
	});

});
//router.post('/doneprogress', function(req, res) {
////	console.log(req.session.doneprogress);
//	if(!global[name]){
//		global[name]=0;
//	}
//	res.json(global[name]);
//});
module.exports = router;