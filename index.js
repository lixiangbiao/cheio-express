var express = require('express')
var path = require('path')
var http = require('http');
var fs = require('fs');
var urllib = require('url');
var util = require('util');
// var request = require('request');
var iconv = require('iconv-lite');
var bodyParser = require('body-parser')
var app = express()
// var expressWs = require('express-ws')(app);
var request = require('request');
var cheerio = require('cheerio');
var superagent = require('superagent');
var xlsx = require('node-xlsx');
var fs = require('fs');
var port = process.env.PORT || 8093;
global.TZTNOPOINT = process.env.TZTNOPOINT || 'http://47.92.104.223:7005';

app.use(express.static(path.join(__dirname, '/dist')))
app.use(bodyParser({
  limit: "500000kb"
}));

// app.get('/file', function (req, res, next) {
//   superagent.get('https://cnodejs.org/')
//     .end(function (err, sres) {
//       if (err) {
//         return next(err);
//       }
//       var $ = cheerio.load(sres.text);
//       var items = [];
//       $('#topic_list .topic_title').each(function (idx, element) {
//         var $element = $(element);
//         items.push({
//           title: $element.attr('title'),
//           href: $element.attr('href')
//         });
//       });

//       res.send(items);
//     });
// });

// app.get('/file', function (req, res, next) {
//   superagent.get('http://app1.sfda.gov.cn/datasearch/face3/base.jsp?tableId=69&tableName=TABLE69&title=%EF%BF%BD%EF%BF%BD%EF%BF%BD%DA%BB%EF%BF%BD%D7%B1%C6%B7&bcId=124053679279972677481528707165&security_verify_data=313932302c31303830')
//     .end(function (err, sres) {
//       if (err) {
//         return next(err);
//       }
//       var $ = cheerio.load(sres.text);
//       var items = [];
//       var table = $("#content table")[2];
//       $(table).find("tr").each(function (idx, element) {
//         if (idx % 2 == 0) {
//           console.log(idx); 
//           var $element = $(element);
//           items.push({
//             title: $element.find("a").text()
//           })
//         }
//       })

//       res.send(items);
//     });
// });

// var data = [
//   [1, 2, 3],
//   [true, false, null, 'sheetjs'],
//   ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'],
//   ['baz', null, 'qux']
// ];
// var buffer = xlsx.build([{
//   name: 'mySheet',
//   data: data
// }]);
// fs.writeFile('test.xlsx', buffer, {
//       'flag': 'w+'
//   }, function(err) {
//       if (err) {
//           return console.error(err);
//       }
//       console.log("写入成功");
//   });
var items = [
  ['标题']
];
app.get('/file', function (req, res, next) {
  var url = "http://app1.sfda.gov.cn/datasearch/face3/base.jsp?tableId=69&tableName=TABLE69&title=%EF%BF%BD%EF%BF%BD%EF%BF%BD%DA%BB%EF%BF%BD%D7%B1%C6%B7&bcId=124053679279972677481528707165&security_verify_data=313932302c31303830"
  request(url, function (err, re, body) {
    // var html = iconv.decode(body, 'gb2312');
    // var $ = cheerio.load(html, { decodeEntities: false })
    //   var table = $("#content table")[2];
    //   $(table).find("tr").each(function (idx, element) {
    //     if (idx % 2 == 0) {
    //       console.log(idx); 
    //       var $element = $(element);
    //       items.push({
    //         title: $element.find("a").text()
    //       })
    //     }
    //   })
    //   res.send(items);
  }).pipe(iconv.decodeStream('gb2312')).collect(function (err, body) {
    var $ = cheerio.load(body, {
      decodeEntities: false
    })
    var table = $("#content table")[2];
    $(table).find("tr").each(function (idx, element) {
      if (idx % 2 == 0) {
        var $element = $(element);
        items.push([$element.find("a").text()])
      }
    })
    res.send(items);
  });
})
app.get('/excel', function (req, res, next) {
  var data = items;
  var buffer = xlsx.build([{
    name: 'mySheet',
    data: data
  }]);
  fs.writeFile('./file/列表标题.xlsx', buffer, {
    'flag': 'w+'
  }, function (err) {
    if (err) {
      res.send({state:0})
      return console.error(err);
    }
    console.log("写入成功");
    res.send({state:1})
  });
})

app.listen(port);
console.log('Listening:' + port);