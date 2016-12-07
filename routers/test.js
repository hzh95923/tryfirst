const router = require('express').Router();
const path = require('path');
const excel2webdata=require('../middleware/excel2webdata.js');
//const getwebdata = require('../middleware/getwebdata.js');

router.get('/', function(req, res) {
	excel2webdata(path.join('./public/upload' + '/test.xlsx'),'http://www.tbdress.eu/productsearch.html',function(err,result){
		if(err) res.json(err);
		return res.json(result);
	});
});

module.exports = router;