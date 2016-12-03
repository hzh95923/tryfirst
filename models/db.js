var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db= mongoose.connection;
db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
	console.log("数据库连接成功");
});
module.exports=db;

