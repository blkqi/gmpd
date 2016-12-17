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

function gpm_call(oper, params) {
    return endpoint + '/' + oper + '?' + Object.keys(params).map(function(key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');
}

app.get('/', function(_req, _res) {
    // TODO validate type: track, radio, album
    if (_req.query.artist || _req.query.title) {
        http.get(gpm_call('search_id', {
            'artist': _req.query.artist,
            'title': _req.query.title,
            'exact': _req.query.exact,
            'type': 'matches'
        }),
        function(res) {
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

function mpc_track(ids, play) {
    if (play) mpc_send('clear', []);
    ids.map(function(id) {
        mpc_send('add', [endpoint + '/get_song?id=' + id]);
    });
    if (play) mpc_send('play', []);
}

function mpc_playlist(res) {
    var stream = fs.createWriteStream("/var/lib/mpd/playlists/tmp.m3u");
    stream.once('open', function(fd) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) { stream.write(chunk) });
        res.on('end', function() { stream.end() });
    });
    stream.once('close', function() {
        mpc_send('clear', []);
        mpc_send('load', ['tmp']);
        mpc_send('play', []);
    });
}

app.post('/load', function(_req, _res) {
    console.log(_req.body);
    switch (_req.body.type) {
        case "track":
            mpc_track(_req.body.track, _req.body.mode==='play')
            break;

        case "radio":
            http.get(gpm_call('get_new_station_by_search', {
                'artist': _req.body.artist,
                'title': _req.body.title,
                'exact': _req.body.exact,
                'type': 'song'
            }), mpc_playlist);
            break;

        case "album":
            http.get(gpm_call('get_album', {
                'id': _req.body.id
            }), mpc_playlist)
            break;
    }
    _res.status(200);
    _res.send();
});

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Example app listening at http://%s:%s', host, port)
})
