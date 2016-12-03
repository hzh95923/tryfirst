const crypto = require('crypto');

module.exports=function(data,arge){
	
	var first=crypto.createHash('md5').update(data).digest('base64');
	return crypto.createHash('md5').update(first+arge).digest('base64');
}
