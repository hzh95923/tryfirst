const express = require('express');
const router = express.Router();
const path=require('path');
const getwebdata = require('../middleware/getwebdata.js');
const excel2webdata=require('../middleware/excel2webdata.js')

//const fs = require('fs');

router.get('/', function(req, res, next) {
	excel2webdata(path.join('./public/upload' + '/test.xlsx'),function(err,result){
		res.json(result);
	});
});

module.exports = router;