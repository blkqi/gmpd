# Google Music Player Daemon

A Node.js application that lets you search for music on Google Play Music and stream to Music Player Daemon. Uses [playmusic](https://github.com/jamon/playmusic) for Google Play Music integration and [mpd.js](https://github.com/andrewrk/mpd.js) to control MPD.

This project is not endorsed by of affiliated with Google in any way.

## Screenshots

| Desktop | Mobile |
| --- | --- |
| <img height="400" alt="desktop" src="https://user-images.githubusercontent.com/778005/52178071-c75fcc80-2797-11e9-94d4-af3d86c166cf.png"> | <img height="400" alt="mobile" src="https://user-images.githubusercontent.com/778005/52178070-c75fcc80-2797-11e9-990a-30926a8113a2.png"> |

## Prerequisites

* MPD server
* Node.js runtime
* Google Play All Access subscription
* "Allow less secure apps" is ON or (with 2FA enabled) an app password

## Installation

Install the dependencies:

```sh
$ npm install
```

### Configuration

Make a copy of `config.json.template` at `config.json` and adjust all variables as necessary. 

## Usage

Run directly with node:

```sh
$ node server.js
```

Then access the web interface at [localhost:3000](http://localhost:3000) (or remotely using the server's IP address).

### Systemd

This app can be run as a service with systemd. An example unit file is provided under `dist/systemd/user`.

## Contributors

* **Cory Kleinschmidt** - [clkmsc](https://github.com/clkmsc)

* **Brett Kleinschmidt** - [blkqi](https://github.com/blkqi)
