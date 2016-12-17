var express = require('express')
var app = express()
var fs = require('fs') // this engine requires the fs module
var mustache = require('mustache')
var http = require('http')
var bodyParser = require('body-parser')
var mpd = require('mpd');
var config = require('./config.json');

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

var endpoint = 'http://' + config.gmp.host + ':' + config.gmp.port;

var mpc = mpd.connect(config.mpd);

function mpc_send(cmd, args) {
    var cmd = mpd.cmd(cmd, args);
    mpc.sendCommand(cmd, function(err, msg) {
        if (err) throw err;
        console.log(msg);
    });
}

function search_url(params, oper) {
    var url = endpoint + oper;
    if (params.artist)
        url += '&artist=' + encodeURIComponent(params.artist);
    if (params.title)
        url += '&title=' + encodeURIComponent(params.title);
    if (params.exact)
        url += '&exact=' + encodeURIComponent(params.exact);
    return url;
}

app.get('/', function(_req, _res) {
    // TODO validate type: track, radio, album
    if (_req.query.artist || _req.query.title) {
        http.get(search_url(_req.query, '/search_id?type=matches'), function(res) {
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
    }
    else _res.render('main');
})

app.post('/load', function(_req, _res) {
    console.log(_req.body);
    switch (_req.body.type) {
        case "":
        case "track":
            if (_req.body.mode == 'play') mpc_send('clear', []);
            _req.body.track.map(function(id) {
                mpc_send('add', [endpoint + '/get_song?id=' + id]);
            });
            if (_req.body.mode == 'play') mpc_send('play', []);
            break;
        case "radio":
            console.log(search_url(_req.body, '/get_new_station_by_search?type=song'));
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
