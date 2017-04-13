function distinct(arr) {
    var obj = {},
        i = 0,
        len = 0;
    if (Array.isArray(arr) && arr.length > 0) {
        len = arr.length;
        for (i = 0; i < len; i += 1) {
            obj[arr[i]] = arr[i];
        }
        return Object.keys(obj);
    }
    return [];
}

module.exports=function(argu){
	if(!argu.data){
		return [];
	}
	if(argu.select){
		var ary=argu.select.split(':'),result=[];
		var key=ary.shift(),val=ary.shift();	
		argu.data.forEach(function(item){
			if(item[key]==val){
				result.push(item[argu.tag]);
			}
		});

		return result;
	}else{
		var result=[];
		argu.data.forEach(function(item){		
			result.push(item[argu.tag]);
		});
		return distinct(result);
	}
}
