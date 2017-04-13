const ose=require('mongoose');
const dao=require('mongoosedao');

var websiteSchema=new ose.Schema({
	name:String,
	page:String,
	lang:Array
});

module.exports=new dao(ose.model('websites',websiteSchema));
