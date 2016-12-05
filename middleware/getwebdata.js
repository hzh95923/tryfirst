const cheerio = require('cheerio');
const superagent = require('superagent');
const async=require('async');

module.exports = function(url, items, callback) {
	async.mapSeries(items, function(item, callback) {
		superagent.get(url)
		.query({'keyword':item[0]})
		.end(function(err, sres) {
			if(err) {
				callback(err, null);
			}
			var $ = cheerio.load(sres.text);
			var items = {};
			$('.Product_grid').each(function(index, element) {
				var $element = $(element);
				items = {
					href: $element.find('.showItems a').attr("href"),
					title: $element.find('.showItems a img').attr("alt"),
					imgurl: $element.find('.showItems a img').attr("src"),
					reviewUrl: $element.find('.review a').attr("href"),
					reviewnum: $element.find('.review a').text(),
					id: $element.find('.hdnPid').val(),
				};
			});
			callback(null, items);
		});

	}, function(err, result) {
		if(err) callback(err, null);
		callback(null, result);
	});
}