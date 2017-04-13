const router = require('express').Router();
const path = require('path');
const upLoadDir = require('config-lite').upLoadDir;
const websites = require(path.join(process.cwd(), '/models/website'));
const getField = require(path.join(process.cwd(), 'middleware/getField'));
const getFiles = require(path.join(process.cwd(), 'middleware/getFiles'));
const async = require('async');

router.get('/', function(req, res, next) {
	res.locals.url = 'list';
	res.locals.title = '网站列表';
	async.waterfall([
			function(cal) {
				websites.getAll(function(err, websites) {
					if(err) cal(err, null);
					var names = getField({
						'data': websites,
						'tag': 'name'
					});
					res.locals.names = names;
					cal(null, names);
				});
			},
			function(data, cal) {
				if(req.query.firstDir && req.query.secondDir && req.query.Data) {
					var firstDir = req.query.firstDir;
					var secondDir = req.query.secondDir;
					res.locals.firstDir = firstDir;
					res.locals.secondDir = secondDir;
					websites.query({
						'name': firstDir
					}, function(err, websites) {
						if(err) cal(err, null);
						var pages = getField({
							'data': websites,
							'tag': 'page'
						});
						var langs = getField({
							'data': websites,
							'select': 'page:' + req.query.secondDir,
							'tag': 'lang'
						});
						res.locals.pages = pages;
						res.locals.langs = langs;
						var dir = path.join(upLoadDir, req.query.firstDir, req.query.secondDir);
						res.locals.websites = websites;
						res.locals.Data = req.query.Data.split('_')[req.query.Data.split('_').length-1];
						getFiles(dir, function(result) {
							result.forEach(function(val, index, arr) {
								val = val.split('.').shift();
								val = val.split('_')[val.split('_').length-1];
								arr[index] = val;
							});
							res.locals.Excels = result;
							cal(null, null);
						});
					});
				} else {
					websites.query({
						'name': data[0]
					}, function(err, websites) {
						var pages = getField({
							'data': websites,

							'tag': 'page'
						});
						var langs = getField({
							'data': websites,
							'select': 'page:' + pages[0],
							'tag': 'lang'
						});
						res.locals.pages = pages;
						res.locals.langs = langs;
						res.locals.firstDir = data[0];
						res.locals.secondDir = pages[0];
						var dir = path.join(upLoadDir, data[0], pages[0]);
						getFiles(dir, function(result) {
							result.forEach(function(val, index, arr) {
								val = val.split('.').shift();
								val = val.split('_')[val.split('_').length-1];
								arr[index] = val;
							});
							res.locals.Data = result[0];
							res.locals.Excels = result;
							cal(null, null);
						});
					});
				}
			}
		],
		function(err, results) {
			if(err) return console.log(err);
			res.render('list');
		});

});
router.post('/getSecondDir', function(req, res, next) {
	async.waterfall([
		function(cal) {
			websites.query({
				'name': req.body.firstDir
			}, function(err, results) {
				if(err) return console.log(err);
				var pages = getField({
					'data': results,
					'tag': 'page'
				});
				var langs = getField({
					'data': results,
					'select': 'page:' + pages[0],
					'tag': 'lang'
				});
				cal(null, {
					'pages': pages,
					'langs': langs
				});
			})
		},
		function(data, cal) {
			var url = path.join(upLoadDir, req.body.firstDir, data.pages[0]);
			getFiles(url, function(result) {
				result.forEach(function(val, index, arr) {
					val = val.split('.').shift();
					val = val.split('_')[val.split('_').length-1];
					arr[index] = val;
				});
				data.excels = result;
				cal(null, data);
			});
		}
	], function(err, result) {
		if(err) return console.log(err);
		res.json(result);
	});

});
router.post('/getData', function(req, res, next) {
	async.waterfall([function(cal) {
		websites.query({
			'name': req.body.firstDir,
			'page': req.body.secondDir
		}, function(err, results) {
			if(err) return console.log(err);
			var langs = getField({
				'data': results,
				'tag': 'lang'
			});
			cal(null, {
				'langs': langs
			});
		});
	}, function(data, cal) {
		var url = path.join(upLoadDir, req.body.firstDir, req.body.secondDir);
		getFiles(url, function(result) {
			result.forEach(function(val, index, arr) {
				val = val.split('.').shift();
				val = val.split('_')[val.split('_').length-1];
				arr[index] = val;
			});
			data.excels = result;
			cal(null, data);
		});
	}], function(err, result) {
		if(err) return console.log(err);
		res.json(result);
	});

});

router.post('/addOrUpdate', function(req, res, next) {
	req.body.langs = req.body.langs.split(',');
	async.waterfall([function(cal) {
		websites.query({
			'name': req.body.firstDir,
			'page': req.body.secondDir
		}, function(err, results) {
			if(err) return console.log(err);
			cal(null, results);
		});
	}, function(results, cal) {
		if(results[0]) {
			websites.updateOne({
				'name': req.body.firstDir,
				'page': req.body.secondDir
			}, {
				'lang': req.body.langs
			}, function(err, result) {
				if(err) return res.json(0);
				cal(null, null);
			})
		} else {
			websites.create({
				'name': req.body.firstDir,
				'page': req.body.secondDir,
				'lang': req.body.langs
			}, function(err, result) {
				if(err) return res.json(0);
				cal(null, null);
			})
		}
	}], function(err, result) {
		if(err) return console.log(err);
		res.json(1);
	});

});
router.post('/delete', function(req, res, next) {
	websites.delete({
		'name': req.body.firstDir,
		'page': req.body.secondDir
	}, function(err, results) {
		if(err) return res.json(0);
		res.json(1);
	});
});
module.exports = router;