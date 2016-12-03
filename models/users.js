var ose=require('mongoose');
var dao=require('mongoosedao');
var userSchema=new ose.Schema({
	name:String,
	pwd:String,
	level:{type:Number,default:0,ref:'level'}
});
module.exports=new dao(ose.model('user',userSchema));
