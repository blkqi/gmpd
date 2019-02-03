# Google Music Player Daemon

A Node.js application that lets you search for music on Google Play Music and stream to Music Player Daemon.

## Prerequisites

* Google Play All Access subscription
* MPD server
* Node.js

## Installation

Coming soon

## Configuration

Make a copy of `config.json.template` at `config.json` and adjust all variables as necessary. 

It is recommended that you create and use an App Password for your Google account.

## Usage

Run directly with node:

```sh
$ node server.js
```

Then access the web interface at <a href="http://localhost:3000">localhost:3000</a>.

### Systemd

Ad example systemd unit file is provided under `dist/systemd/user`
