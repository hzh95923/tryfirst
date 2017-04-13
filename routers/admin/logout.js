const router = require('express').Router();

router.get('/', function(req, res, next) {
	req.session.username = null;
	res.redirect('/login');
});

module.exports = router;