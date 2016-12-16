const cheerio = require('cheerio');
const superagent = require('superagent');
const async = require('async');

module.exports = function(url, item, callback) {
	superagent.get(url)
		.query({
			'keyword': item
		})
		.end(function(err, sres) {
			if(err) {
				callback(err, null);
			}
			var $ = cheerio.load(sres.text);
			$('.Product_grid').each(function(index, element) {
				var $element = $(element);
				result = {
					imgname: item,
					href: $element.find('.showItems a').attr("href"),
					title: $element.find('.showItems a img').attr("alt"),
					imgurl: $element.find('.showItems a img').attr("src"),
					reviewUrl: $element.find('.review a').attr("href"),
					reviewnum: $element.find('.review a').text(),
					id: $element.find('.hdnPid').val(),
				};
			});
			return callback(null, result);
		});
}