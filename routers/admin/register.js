const router = require('express').Router();
const path=require('path');
const md5 = require(path.join(process.cwd(),'/middleware/md5'));
const users = require(path.join(process.cwd(),'/models/users'));
const async = require('async');


router.get('/', function(req, res, next) {
	res.render('register', {
		username: '',
		title: '注册',
		url:'register'
	});
});

router.post('/', function(req, res, next) {
	var name = req.body.name;
	var pwd = md5(req.body.pwd, "123654");
	async.waterfall([
		function(callback) {
			users.query({
				'name': name
			}, function(err, user) {
				if(err) callback(err, null);
				callback(null, user);
			});
		},
		function(user, callbak) {
			if(user.length >= 1) {
				res.json(0);
			} else {
				users.create({
					"name": name,
					"pwd": pwd
				}, function(err, user) {
					if(err) callback(err, null);
					req.session.username = name;
					req.session.level = 0;
					res.json(1);
				});
			}
		}
	], function(error, result) {
		console.log('error: ' + error);
		res.json(0);
	});
});
module.exports = router;