const check = require('../middleware/check.js');
module.exports = function(app) {
	//	登录验证
	//app.use(/^(?!.*(\/login|\/register))/,check.checkLogin);
	//app.use(/\/login|\/register/,check.checkNotLogin);
	app.use('/', require('./admin/index'));
	app.use('/register', require('./admin/register'));
	app.use('/login', require('./admin/login'));
	app.use('/logout', require('./admin/logout'));
	app.use('/transmission', require('./admin/transmission'));
	app.use('/list', require('./admin/list'));
	app.use('/test', require('./test')());
	app.use('/webhtml', require('./webhtml/index'));
	app.use(function(req, res) {
		res.status('404');
		res.render('404');
	});
}