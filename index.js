var express = require('express');
var fs = require('fs');
var url = require('url');
var https = require('https');
var mustache = require('mustache');
var bodyParser = require('body-parser');
var tmp = require('tmp');
var mpd = require('mpd');
var config = require('./config.json');
var PlayMusic = require('playmusic');
var id3 = require('node-id3');

// PlayMusic setup

var pm = new PlayMusic();

pm.init(config.gmp, function(err) {
    if (err) throw err;
});

// MPD setup

var mpc = mpd.connect(config.mpd);

function play_url(req, id) {
    return url.format({
        'protocol': req.protocol,
        'hostname': req.hostname,
        'port': 3000,
        'pathname': 'play.mp3',
        'query': {'id': id}
    });
}

function mpc_clear_cmd() { return mpd.cmd('clear', []) };
function mpc_play_cmd() { return mpd.cmd('play', []) };
function mpc_load_cmd(req, id) { return mpd.cmd('add', [play_url(req, id)]) };

function mpc_callback(err, msg) { 
    if (err) throw err;
    if (msg) console.log(msg);
}

function mpc_add_track(req, ids, play) {
    if (play) mpc.sendCommand(mpc_clear_cmd(), mpc_callback);
    ids.map(function(id) { mpc.sendCommand(mpc_load_cmd(req, id), mpc_callback) });
    if (play) mpc.sendCommand(mpc_play_cmd(), mpc_callback);
}

// Express setup

var app = express();

app.engine('mu', function (filePath, options, callback) {
    fs.readFile(filePath, function (err, content) {
        if (err) return callback(new Error(err))
        var rendered = mustache.render(content.toString(), options.view, options.partials)
        return callback(null, rendered)
    })
})

app.set('views', './views')
app.set('view engine', 'mu')

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

function render_params(info) {
    var params = { };
    params.view = info;
    params.partials = { 'search': fs.readFileSync(app.get('views') + '/search.mu').toString() };
    return params;
}

var max_results = config.max_results || 25;

app.get('/', function(_req, _res) {
    var entry_type = function(entries, key, type) {
        return entries.filter(function(entry) { return entry.type == type }).map(function(entry) { return entry[key] });
    };

    if (_req.query.q) {
        pm.search(_req.query.q, max_results, function (err, data) {
            _res.render('main', render_params({
                'tracks'  : entry_type(data.entries, 'track', '1'),
                'artists' : entry_type(data.entries, 'artist', '2').slice(0, 8),
            }));
        });
    }
    else _res.render('main');
});

app.get('/artist', function(_req, _res) {
    if (_req.query.id) {
        pm.getArtist(_req.query.id, false, max_results, 0, function (err, data) {
            data.tracks = data.topTracks;
            delete data.topTracks;
            _res.render('main', render_params(data));
        });
    }
    else _res.render('main');
});

app.get('/album', function(_req, _res) {
    if (_req.query.id) {
        pm.getAlbum(_req.query.id, true, function (err, data) {
            _res.render('main', render_params(data));
        });
    }
    else _res.render('main');
});

function id3_wrapper(id, callback) {
    pm.getAllAccessTrack(id, function(err, track) {
        var tags = {
            'artist' : track.artist,
            'album' : track.album,
            'title' : track.title,
            //'year' : track.year
        };
        tmp.file(function(err, path, fd) {
            if (err) throw err;
            var sts = id3.write(tags, path);
            callback(sts, fs.readFileSync(path));
        });
    });
}

app.get('/play.mp3', function(_req, _res) {
    if (_req.query.id) {
        pm.getStreamUrl(_req.query.id, function(err, url) {
            https.get(url, function(res) {
                _res.status(res.statusCode);
                if (res.statusCode === 200) {
                    id3_wrapper(_req.query.id, function(sts, data) {
                        if (sts) _res.write(data);
                        res.on('data', function(chunk) { _res.write(chunk) });
                        res.on('end', function() { _res.send(); });
                    });
                }
                else _res.end();
            });
        });
    }
    else _res.status(400).end();
});

app.post('/load', function(_req, _res) {
    switch (_req.body.type) {
        case "track":
            mpc_add_track(_req, _req.body.track, _req.body.mode==='play')
            break;

        case "radio":
            pm.createStation('radio:' + _req.body.id, _req.body.id, "track", function(err, body) {
                pm.getStationTracks(body.mutate_response[0].id, max_results, function(err, data) {
                    var ids = data.data.stations[0].tracks.map(function(track) { return track.nid; });
                    mpc_add_track(_req, ids, true)
                });
            });
            break;

        case "album":
            pm.getAlbum(_req.body.id, true, function(err, data) {
                var ids = data.tracks.map(function(track) { return track.nid; });
                mpc_add_track(_req, ids, _req.body.mode==='play')
            });
            break;
    }
    _res.status(202).end();
});

var server = app.listen(3000, function() {
    var host = server.address().address
    var port = server.address().port
    console.log('Example app listening at http://%s:%s', host, port)
})
