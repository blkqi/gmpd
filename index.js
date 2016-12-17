var express = require('express')
var app = express()
var fs = require('fs') // this engine requires the fs module
var mustache = require('mustache')
var http = require('http')

// Adding the template engine to ExpressJS
app.engine('mu', function (filePath, options, callback) { // define the template engine
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(new Error(err))
  // Process view
    var rendered = mustache.render(content.toString(), options.view, options.partials)

    return callback(null, rendered)
  })
})

app.set('views', './views') // specify the views directory
app.set('view engine', 'mu') // register the template engine

app.get('/', function(_req, _res) {
    http.get('http://192.168.1.22:9999/search_id?type=matches&artist=Quik', function(res) {
        const statusCode = res.statusCode;
        const contentType = res.headers['content-type'];
        var data = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) { data += chunk });
        res.on('end', function() {
            _res.render('test', {
                'view': JSON.parse(data),
                'partials': {// Pick up partials string content from disk
                    hello: fs.readFileSync(app.get('views') + '/hello.mu').toString()
                }
            })
        });
    })

})

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Example app listening at http://%s:%s', host, port)
})
