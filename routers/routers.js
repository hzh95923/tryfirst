const check = require('../middleware/check.js');
module.exports = function(app) {
	//	登录验证
	//app.use(/^(?!.*(\/login|\/register))/,check.checkLogin);
	//app.use(/\/login|\/register/,check.checkNotLogin);
	app.use('/', require('./index'));
	app.use('/register', require('./register'));
	app.use('/login', require('./login'));
	app.use('/logout', require('./logout'));
	app.use('/test', require('./test')(app.io));
	app.use(function(req, res) {
		res.status('404');
		res.render('404');
	});
}