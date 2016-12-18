var express = require('express');
var fs = require('fs');
var https = require('https');
var mustache = require('mustache');
var bodyParser = require('body-parser');
var mpd = require('mpd');
var config = require('./config.json');
var PlayMusic = require('playmusic');

// PlayMusic setup

var pm = new PlayMusic();

pm.init(config.gmp, function(err) {
    if (err) throw err;
});

// MPD setup

var mpc = mpd.connect(config.mpd);

mpc_callback = function(err, msg) { 
    if (err) throw err;
    if (msg) console.log(msg);
}

function mpc_add_track(ids, play) {
    if (play) mpc.sendCommand(mpd.cmd('clear', []), mpc_callback);
    ids.map(function(id) {
        var url = 'http://localhost:3000/play?id=' + encodeURIComponent(id);
        mpc.sendCommand(mpd.cmd('add', [url]), mpc_callback);
        if (play) {
            mpc.sendCommand(mpd.cmd('play', []), mpc_callback);
            play = false; // only play once
        }
    });
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
    if (_req.query.artist || _req.query.title) {
        var query = _req.query.artist + ' ' + _req.query.title;
        pm.search(query, 25, function(err, data) {
            _res.render('main', {
                'view': data.entries.filter(function(entry) { return entry.type == '1' }),
                'partials': {
                    'search': fs.readFileSync(app.get('views') + '/search.mu').toString()
                }
            });
        }, function(msg, body, err, res) {
            if (err) throw err;
            if (msg) console.log(msg);
        });
    }
    else _res.render('main');
})

app.get('/play', function(_req, _res) {
    pm.getStreamUrl(_req.query.id, function(err, url) {
        https.get(url, function(res) {
            _res.status(res.statusCode);
            if (res.statusCode === 200) {
                res.on('data', function(chunk) { _res.write(chunk) });
                res.on('end', function() { _res.send(); });
            }
            else _res.end();
        })
    });
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
                    var ids = info.data.stations[0].tracks.map(function(track) {
                        return track.nid;
                    });
                    mpc_add_track(ids, true)
                });
            });
            break;

        case "album":
            pm.getAlbum(_req.body.id, true, function(err, info) {
                var ids = info.tracks.map(function(track) {
                    return track.nid;
                });
                mpc_add_track(ids, true)
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
