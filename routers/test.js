const express = require('express');
const router = express.Router();
const path = require('path');
const excel2webdata=require('../middleware/excel2webdata.js');
//const getwebdata = require('../middleware/getwebdata.js');

router.get('/', function(req, res, next) {
	excel2webdata(path.join('./public/upload' + '/test.xlsx'),'http://www.dressilyme.com//productsearch.html',function(err,result){
		if(err) res.json(err);
		return res.json(result);
	});
});

module.exports = router;