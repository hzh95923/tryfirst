const express = require('express');
const path = require("path");
const db = require("./models/db");
const mongoosedao = require('mongoosedao');
const bodyparser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const pkg = require('./package');
const config = require('config-lite');
const routers = require('./routers/routers');

var app = express();

app.locals.cms = {
	title: pkg.name,
	description: pkg.description
}
app.set('trust proxy', 1); // trust first proxy 
app.use(session({
	name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
	secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
	cookie: {
		maxAge: config.session.maxAge // 过期时间，过期后 cookie 中的 session id 自动删除
	},
	resave: false,
	saveUninitialized: true
}));
// flash 中间件，用来显示通知
app.use(flash());

app.use(function(req, res, next) {
	res.locals.username = req.session.username;
	res.locals.userlevel = req.session.userlevel;
	res.locals.success = req.flash('success').toString();
	res.locals.error = req.flash('error').toString();
	next();
});
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
	extended: false
}));

routers(app);

process.on('uncaughtException', function(err) {
	console.error('Error caught in uncaughtException event:', err);
});

app.listen(config.port, function() {
	console.log(`${pkg.name} listening on port ${config.port}`);
});