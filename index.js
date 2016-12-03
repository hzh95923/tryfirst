const express=require('express');
const path=require("path");
const db=require("./models/db");
const mongoosedao=require('mongoosedao');
const routers=require('./routers/routers');
const bodyparser=require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

上传
var app=express();
app.set('trust proxy', 1); // trust first proxy 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
// flash 中间价，用来显示通知
app.use(flash());
app.set("webname","日常管理");
app.set("view engine","ejs");

app.use(express.static(path.join(__dirname,'/public')));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

routers(app);

app.listen(3000);
