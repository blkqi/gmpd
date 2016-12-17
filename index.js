var express = require('express')
var app = express()
var fs = require('fs') // this engine requires the fs module
var mustache = require('mustache')
var http = require('http')
var bodyParser = require('body-parser')
// Adding the template engine to ExpressJS
app.engine('mu', function (filePath, options, callback) { // define the template engine
    fs.readFile(filePath, function (err, content) {
        if (err) return callback(new Error(err))
    
        // Process view
        var rendered = mustache.render(content.toString(), options.view, options.partials)

        return callback(null, rendered)
    })
})

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('views', './views') // specify the views directory
app.set('view engine', 'mu') // register the template engine

var endpoint = 'http://192.168.1.22:9999';

function search_url(req) {
    var url = endpoint + '/search_id?type=matches';
    if (req.query.artist)
        url += '&artist=' + encodeURIComponent(req.query.artist);
    if (req.query.title)
        url += '&title=' + encodeURIComponent(req.query.title);
    if (req.query.exact)
        url += '&exact=' + encodeURIComponent(req.query.exact);
    console.log(url);
    return url;
}

app.get('/', function(_req, _res) {
    if (_req.query.artist || _req.query.title) {
        http.get(search_url(_req), function(res) {
            const statusCode = res.statusCode;
            const contentType = res.headers['content-type'];
            var data = '';
            res.setEncoding('utf8');
            res.on('data', function(chunk) { data += chunk });
            res.on('end', function() {
                _res.render('main', {
                    'view': JSON.parse(data),
                    'partials': {
                        search: fs.readFileSync(app.get('views') + '/search.mu').toString()
                    }
                });
            });
        })
    } else {
        _res.render('main');
    }
})

app.post('/load', function(_req, _res) {
    console.log(_req.body);
    switch (_req.body.type) {
        case "track":
            _req.body.track.map(function(id) {
                console.log('mpd add ' + endpoint + '/get_song?id=' + id);
            });
            break;
        case "radio":
            // TODO
            break;
        case "album":
            // TODO
            break;
    }
});

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Example app listening at http://%s:%s', host, port)
})
