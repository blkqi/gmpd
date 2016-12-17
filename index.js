var express = require('express')
var app = express()
var fs = require('fs') // this engine requires the fs module
var mustache = require('mustache')

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

// Simple example using mustachejs
app.get('/', function (req, res) {
// Send response
  res.render('test', {
    'view': {
      title: 'Test with express and mustachejs',
      name: 'World'
    },
    'partials': {// Pick up partials string content from disk
      hello: fs.readFileSync(app.get('views') + '/hello.mu').toString()
    }
  })
})

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})
