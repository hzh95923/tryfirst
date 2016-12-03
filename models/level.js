const ose=require('mongoose');
const dao=require('mongoosedao');

var levelSchema=new ose.Schema({
	id:{type:Number,unique:true},
	description:String
});

module.exports=new dao(ose.model('level',levelSchema));
