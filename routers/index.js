const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index', {
		'title': "首页"
	});
});

router.post('/', function(req, res, next) {

});
module.exports = router;