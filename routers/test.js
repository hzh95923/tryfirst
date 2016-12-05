const express = require('express');
const router = express.Router();
const getwebdata=require('../middleware/getwebdata');
const async=require('async');

router.get('/',function(req,res,next){
	async.waterfall([
		function(callback){
			var arr=[];
			var items=['sod35583','sod12408'];
			async.mapSeries(items,function(item,callback){
				getwebdata('http://www.dressilyme.com/productsearch.html',{'keyword':'sod35583'},function(err,data){
					if(err)callback(err,null);
					arr.push(data);
					//callback(arr);
				},function(err,result){
					callback(null,arr);
				});
				
			});
//			getwebdata('http://www.dressilyme.com/productsearch.html',{'keyword':'sod35583'},function(err,data){
//				if(err)callback(err,null);
//				callback(null,data);
//			});
		},
		function(data,callback){
			res.json(data);
		}
	],function(error, result) {
		console.log('error: ' + error);
		res.json(0);
	});
});

module.exports=router;