const express = require('express');
const router = express.Router();
const md5 = require('../middleware/md5');
const users = require('../models/users');
const async = require('async');

router.get('/', function(req, res, next) {
	res.render('login', {
		username: '',
		title: '登录'
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
			if(user.length == 0) {
				res.json(0);
			} else if(user[0].pwd !== pwd) {

				res.json(-1);
			} else {
				req.session.username = user[0].name;
				req.session.userlevel = user[0].level;
				res.json(1);
			}
		}
	], function(error, result) {
		console.log('error: ' + error);
		res.json(0);
	});
});
module.exports = router;