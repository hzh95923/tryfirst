const cheerio = require('cheerio');
const superagent = require('superagent');

module.exports=function(url,query,callback){
  superagent.get(url)
  	.query(query)
    .end(function (err, sres) {
      if (err) {
        callback(err,null);
      }
      var $ = cheerio.load(sres.text);
      var items = {};
      $('.Product_grid').each(function (index, element) {
        var $element = $(element);
        items={
          href: $element.find('.showItems a').attr("href"),
          title: $element.find('.showItems a img').attr("alt"),
          imgurl:$element.find('.showItems a img').attr("src"),
          reviewUrl:$element.find('.review a').attr("href"),
          reviewnum:$element.find('.review a').text(),
          id:$element.find('.hdnPid').val(),
        };
      });
      callback(items);
    });
}