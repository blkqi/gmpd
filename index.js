var express = require('express');
var fs = require('fs');
var https = require('https');
var mustache = require('mustache');
var bodyParser = require('body-parser');
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

mpc_clear_cmd = function() { return mpd.cmd('clear', []) };
mpc_play_cmd = function() { return mpd.cmd('play', []) };
mpc_load_cmd = function(id) { return mpd.cmd('add', ['http://localhost:3000/play?id=' + encodeURIComponent(id)]) };

mpc_callback = function(err, msg) { 
    if (err) throw err;
    if (msg) console.log(msg);
}

function mpc_add_track(ids, play) {
    if (play) mpc.sendCommand(mpc_clear_cmd(), mpc_callback);
    ids.map(function(id) { mpc.sendCommand(mpc_load_cmd(id), mpc_callback) });
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

app.get('/', function(_req, _res) {
    if (_req.query.q) {
        pm.search(_req.query.q, 25, function(err, data) {
            _res.render('main', {
                'view': data.entries.filter(function(entry) { return entry.type == '1' }),
                'partials': { 'search': fs.readFileSync(app.get('views') + '/search.mu').toString() }
            });
        }, function(msg, body, err, res) {
            if (err) throw err;
            if (msg) console.log(msg);
        });
    }
    else _res.render('main');
})

var tmp = require('tmp');

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

app.get('/play', function(_req, _res) {
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
            mpc_add_track(_req.body.track, _req.body.mode==='play')
            break;

        case "radio":
            var name = _req.body.artist + ' ' + _req.body.title + ' Radio';
            pm.createStation(name, _req.body.id, "track", function(err, body) {
                pm.getStationTracks(body.mutate_response[0].id, 25, function(err, info) {
                    var ids = info.data.stations[0].tracks.map(function(track) { return track.nid; });
                    mpc_add_track(ids, true)
                });
            });
            break;

        case "album":
            pm.getAlbum(_req.body.id, true, function(err, info) {
                var ids = info.tracks.map(function(track) { return track.nid; });
                mpc_add_track(ids, _req.body.mode==='play')
            });
            break;
    }
    _res.status(202);
    _res.send();
});

var server = app.listen(3000, function() {
    var host = server.address().address
    var port = server.address().port
    console.log('Example app listening at http://%s:%s', host, port)
})
