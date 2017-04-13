const router = require('express').Router();
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
const upLoadDir = require('config-lite').upLoadDir;
const getDataToObject = require(path.join(process.cwd(), 'middleware/getData')).ToObject;
const websites = require(path.join(process.cwd(), 'models/website'));
const getField = require(path.join(process.cwd(), 'middleware/getField'));
const getFiles = require(path.join(process.cwd(), 'middleware/getFiles'));
const async = require('async');

router.get('/', function(req, res) {
	res.locals.url = 'transmission';
	res.locals.title = '表格传输';
	websites.all(function(err, websites) {
		if(err) return console.log(err);
		var names = getField({
			'data': websites,
			'tag': 'name'
		});
		var pages = getField({
			'data': websites,
			'select': 'name:' + names[0],
			'tag': 'page'
		});
		res.locals.names = names;
		res.locals.pages = pages;
		var dir = path.join(upLoadDir, names[0], pages[0]);
		getFiles(dir, function(result) {
			result.forEach(function(val, index, arr) {
				val = val.split('.').shift();
				val = val.split('_')[val.split('_').length - 1];
				arr[index] = val;
			});
			res.locals.excels = result;
			res.render('transmission');
		});
	});

});
router.post('/getdir', function(req, res) {
	websites.query({
		"name": req.body.dir
	}, function(err, websites) {
		if(err) return console.log(err);
		var pages = getField({
			'data': websites,
			'tag': 'page'
		});
		res.json(pages);
	});
});

router.post('/getexcel', function(req, res) {

	var dir = path.join(upLoadDir, req.body.firstDir, req.body.secondDir);
	getFiles(dir, function(result) {
		result.forEach(function(val, index, arr) {
			val = val.split('.').shift();
			val = val.split('_')[val.split('_').length - 1];
			arr[index] = val;
		});
		res.json(result);
	});
});

router.get('/files/:firstDir/:secondDir/:Excel', function(req, res) {
	var dir = path.join(upLoadDir, req.params.firstDir, req.params.secondDir, req.params.firstDir + '_' + req.params.secondDir + '_' + req.params.Excel + '.xlsx');
	var stats = fs.statSync(dir);
	if(stats.isFile()) {
		res.set({
			'Content-Type': 'application/octet-stream',
			'Content-Disposition': 'attachment; filename=' + req.params.firstDir + '_' + req.params.secondDir + '_' + req.params.Excel + '.xlsx',
			'Content-Length': stats.size
		});
		fs.createReadStream(dir).pipe(res);
	} else {
		res.end(404);
	}
});

router.post('/', function(req, res) {
	var form = new formidable.IncomingForm();
	form.uploadDir = upLoadDir;
	form.parse(req, function(err, fields, files) {
		if(files.upfiles.name) {
			var data = files.upfiles.name.split('.')[0];
			var oldpath = path.join(form.uploadDir, files.upfiles.path);
			var firstdir = path.join(form.uploadDir, fields.firstdir);
			var seconddir = path.join(form.uploadDir, fields.firstdir, fields.seconddir);
			var newpath = path.join(form.uploadDir, fields.firstdir, fields.seconddir, files.upfiles.name);
			async.series([
				function(cal) {
					fs.access(firstdir, fs.constants.F_OK, (err) => {
						if(err) {
							fs.mkdir(firstdir, function(err) {
								if(err) return console.log(err);
								cal(null, null);
							})
						} else {
							cal(null, null);
						}
					});
				},
				function(cal) {
					fs.access(seconddir, fs.constants.F_OK, (err) => {
						if(err) {
							fs.mkdir(seconddir, function(err) {
								if(err) return console.log(err);
								cal(null, null);
							})
						} else {
							cal(null, null);
						}
					});
				}
			], function(err, results) {
				fs.rename(oldpath, newpath, function(err) {
					if(err) res.json(1);
					res.json({
						'firstDir': fields.firstdir,
						'secondDir': fields.seconddir,
						'Data': data
					});
				});
			});

		} else {
			return res.json(0);
		}
	});
});
module.exports = router;