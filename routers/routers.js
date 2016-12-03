const check=require('../middleware/check.js');
module.exports=function(app){
	
	app.use(/^(?!.*(\/login|\/register))/,check.checkLogin);
	app.use(/\/login|\/register/,check.checkNotLogin);
	app.use(['/','/index','/index.html'],require('./index'));
	app.use('/register',require('./register'));
	app.use('/login',require('./login'));
	app.use('/logout',require('./logout'));
	app.use(function(req,res){
		res.status('404');
		res.render('404');
	});
}
