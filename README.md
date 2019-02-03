# Google Music Player Daemon

A Node.js application that lets you search for music on Google Play Music and stream to Music Player Daemon. Uses [playmusic](https://github.com/jamon/playmusic) for Google Play Music integration.

This project is not endorsed by of affiliated with Google in any way.

## Prerequisites

* Google Play All Access subscription
* MPD server
* Node.js

## Installation

Install the dependencies:

```sh
$ npm install
```

### Configuration

Make a copy of `config.json.template` at `config.json` and adjust all variables as necessary. 

It is recommended that you create and use an App Password for your Google account.

## Usage

Run directly with node:

```sh
$ node server.js
```

Then access the web interface at [localhost:3000](http://localhost:3000).

### Systemd

Ad example systemd unit file is provided under `dist/systemd/user`

## Contributors

* **Cory Kleinschmidt** - [clkmsc](https://github.com/clkmsc)

* **Brett Kleinschmidt** - [blkqi](https://github.com/blkqi)
