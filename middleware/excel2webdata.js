const async = require('async');
const xlsx = require('node-xlsx');
const path = require('path');
const getwebdata = require('./getwebdata.js');

const express = require('express');
var app = express();
//socket.io公式：
var http = require('http').Server(app);
var io = require('socket.io')(http);

module.exports = function(name, file, url, callback) {
	//获取excel中的数据
	var obj = xlsx.parse(file),
		result = {},
		arr = [],
		allnum = 0,
		donenum = 0;
	obj.forEach(function(item) {
		var data = [];
		for(var i in item.data) {
			var value = item.data[i][0];
			if(value) {
				data.push(value);
			}
		}
		result[item.name] = data;
		allnum = allnum + data.length;
	});
	for(var keys in result) {
		arr.push(result[keys]);
	}
	async.mapSeries(arr, function(items, callback) {
		async.mapLimit(items, 2, function(item, callback) {
			getwebdata(url, item, function(err, result) {
				if(err) callback(err, null);

				//global[name]=Math.floor(++donenum/allnum*100);

				io.on("connection", function(socket) {
					socket.emit(name, Math.floor(++donenum/allnum*100));
				});
				callback(null, result);
			});
		}, function(err, result) {
			if(err) callback(err, null);
			callback(null, result);
		});

	}, function(err, result) {

		if(err) callback(err, null);
		callback(null, result);
	});

}