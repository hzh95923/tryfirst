const express = require('express');
const path = require("path");
const db = require("./models/db");
//const mongoosedao = require('mongoosedao');
const bodyparser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const pkg = require('./package');
const config = require('config-lite');
const routers = require('./routers/routers');
const compression = require('compression')

var app = express();
//gzip压缩
app.use(compression());
//实时通讯
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.io=io;
io.on("connection", function(socket) {});

//设置全局变量
app.locals.cms = {
		title: pkg.name,
		description: pkg.description
	}
//支持代理
//app.set('trust proxy', 1); // trust first proxy 
//使用express-session挂载session信息
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

//设置局部变量
app.use(function(req, res, next) {
	res.locals.username = req.session.username;
	res.locals.userlevel = req.session.userlevel;
	res.locals.success = req.flash('success').toString();
	res.locals.error = req.flash('error').toString();
	next();
});
//设置模板引擎
app.set("view engine", "ejs");
//设置静态文件目录
app.use(express.static(path.join(__dirname, '/public')));
//使用bodyparser解析请求体
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
	extended: false
}));
//绑定路由
routers(app);

//捕获错误
process.on('uncaughtException', function(err) {
	console.error('Error caught in uncaughtException event:', err);
});

//端口监听
server.listen(config.port, function() {
	console.log(`${pkg.name} listening on port ${config.port}`);
});