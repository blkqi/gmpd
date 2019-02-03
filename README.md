# Google Music Player Daemon

A Node.js application that lets you search for music on Google Play Music and stream to Music Player Daemon. Uses [playmusic](https://github.com/jamon/playmusic) for Google Play Music integration.

This project is not endorsed by of affiliated with Google in any way.

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

Then access the web interface at [localhost:3000](http://localhost:3000).

### Systemd

This app can be run as a service with systemd. An example unit file is provided under `dist/systemd/user`.

## Contributors

* **Cory Kleinschmidt** - [clkmsc](https://github.com/clkmsc)

* **Brett Kleinschmidt** - [blkqi](https://github.com/blkqi)
