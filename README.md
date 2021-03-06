<h1 align="center">
  PeerTube
</h1>

<h4 align="center">
Decentralized video streaming platform using P2P (BitTorrent) directly in the web browser with <a href="https://github.com/feross/webtorrent">WebTorrent</a>.
</h4>

**PeerTube is sponsored by [Framasoft](https://framatube.org/#en), a non-profit that promotes, spreads and develops free-libre software. If you want to support this project, please [consider donating them](https://soutenir.framasoft.org/en/).**

<p align="center">
  <strong>Client</strong>

  <br />

  <a href="https://david-dm.org/Chocobozzz/PeerTube?path=client">
    <img src="https://david-dm.org/Chocobozzz/PeerTube.svg?path=client" alt="Dependency Status" />
  </a>

  <a href="https://david-dm.org/Chocobozzz/PeerTube?path=client#info=dev">
    <img src="https://david-dm.org/Chocobozzz/PeerTube/dev-status.svg?path=client" alt="devDependency Status" />
  </a>
</p>

<p align="center">
  <strong>Server</strong>

  <br />

  <a href="https://travis-ci.org/Chocobozzz/PeerTube">
    <img src="https://travis-ci.org/Chocobozzz/PeerTube.svg?branch=develop" alt="Build Status" />
  </a>

  <a href="https://david-dm.org/Chocobozzz/PeerTube">
    <img src="https://david-dm.org/Chocobozzz/PeerTube.svg" alt="Dependencies Status" />
  </a>

  <a href="https://david-dm.org/Chocobozzz/PeerTube#info=dev">
    <img src="https://david-dm.org/Chocobozzz/PeerTube/dev-status.svg" alt="devDependency Status" />
  </a>

  <a href="http://standardjs.com/">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg" alt="JavaScript Style Guide" />
  </a>

  <a href="https://kiwiirc.com/client/irc.freenode.net/#peertube">
    <img src="https://img.shields.io/badge/%23peertube-on%20freenode-brightgreen.svg" alt="PeerTube Freenode IRC" />
  </a>
</p>

<br />

<p align="center">
  <a href="https://peertube.cpy.re">
    <img src="https://lutim.cpy.re/9HOUfGK8" alt="screenshot" />
  </a>
</p>

## Demonstration

Want to see in action?

   * [Demo server](http://peertube.cpy.re)
   * [Video](https://peertube.cpy.re/videos/watch/f78a97f8-a142-4ce1-a5bd-154bf9386504) to see how the "decentralization feature" looks like
   * Experimental demo servers that share videos (they are in the same network): [peertube2](http://peertube2.cpy.re), [peertube3](http://peertube3.cpy.re). Since I do experiments with them, sometimes they might not work correctly.

## Why

We can't build a FOSS video streaming alternatives to YouTube, Dailymotion, Vimeo... with a centralized software. One organization alone cannot have enough money to pay bandwidth and video storage of its server.

So we need to have a decentralized network (as [Diaspora](https://github.com/diaspora/diaspora) for example).
But it's not enough because one video could become famous and overload the server.
It's the reason why we need to use a P2P protocol to limit the server load.
Thanks to [WebTorrent](https://github.com/feross/webtorrent), we can make P2P (thus bittorrent) inside the web browser right now.

## Features

- [X] Frontend
  - [X] Angular frontend
- [X] Join the fediverse
  - [X] Follow other instances
  - [X] Unfollow an instance
  - [X] Get for the followers/following list
- [X] Upload a video
  - [X] Seed the video
  - [X] Send the meta data with ActivityPub to followers
- [X] Remove the video
- [X] List the videos
- [X] View the video in an HTML5 player with WebTorrent
- [X] Admin panel
- [X] OpenGraph tags
- [X] OEmbed
- [X] Update video
- [X] Videos view counter
- [X] Videos likes/dislikes
- [X] Transcoding to different definitions
- [X] Download file/torrent
- [X] User video bytes quota
- [X] User video channels
- [X] NSFW warnings/settings
- [X] Video description in markdown
- [X] User roles (administrator, moderator)
- [X] User registration
- [X] Video privacy settings (public, unlisted or private)
- [X] Signaling a video to the admin origin PeerTube instance
- [ ] Videos comments
- [ ] User playlist
- [ ] User subscriptions (by tags, author...)
- [ ] Add "DDOS" security


## Installation

See [wiki](https://github.com/Chocobozzz/PeerTube/wiki) for complete installation commands.

### Front compatibility

  * Chromium
  * Firefox (>= 42 for MediaSource support)

### Dependencies

  * **NodeJS >= 6.x**
  * **npm >= 3.x**
  * yarn
  * OpenSSL (cli)
  * PostgreSQL
  * FFmpeg

#### Debian

  1. Install NodeJS 6.x (previous LTS): [https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
  2. Install yarn: [https://yarnpkg.com/en/docs/install](https://yarnpkg.com/en/docs/install)
  3. Add jessie backports to your *source.list*: http://backports.debian.org/Instructions/
  4. Run:

        $ apt-get update
        $ apt-get install ffmpeg postgresql-9.4 openssl

#### Ubuntu 16.04

  1. Install NodeJS 8.x (current LTS): (same as Debian)
  2. Install yarn: (same as Debian)
  3. Run:

        $ apt-get update
        $ apt-get install ffmpeg postgresql openssl

#### Other distribution... (PR welcome)


### Sources

    $ git clone -b master https://github.com/Chocobozzz/PeerTube
    $ cd PeerTube
    $ yarn install
    $ npm run build

## Usage

### Production

If you want to run PeerTube for production (bad idea for now :) ):

    $ cp config/production.yaml.example config/production.yaml

Then edit the `config/production.yaml` file according to your webserver configuration. Keys set in this file will override those of `config/default.yml`.

Finally, run the server with the `production` `NODE_ENV` variable set.

    $ NODE_ENV=production npm start

The administrator password is automatically generated and can be found in the logs. You can set another password with:

    $ NODE_ENV=production npm run reset-password -- -u root

**Nginx template** (reverse proxy): https://github.com/Chocobozzz/PeerTube/tree/master/support/nginx <br />
**Systemd template**: https://github.com/Chocobozzz/PeerTube/tree/master/support/systemd

You can check the application (CORS headers, tracker websocket...) by running:

    $ NODE_ENV=production npm run check

### Upgrade

The following commands will upgrade the source (according to your current branch), upgrade node modules and rebuild client application:

    # systemctl stop peertube
    $ npm run upgrade-peertube
    # systemctl start peertube

### Development

In this mode, the server will run requests between instances more quickly, the video durations are limited to a few seconds.

To develop on the server-side (server files are automatically compiled when we modify them and the server restarts automatically too):

    $ npm run dev:server

The server (with the client) will listen on `localhost:9000`.


To develop on the client side (client files are automatically compiled when we modify them):

    $ npm run dev:client

The API will listen on `localhost:9000` and the frontend on `localhost:3000` (with hot module replacement, you don't need to refresh the web browser).

**Username**: *root* <br/>
**Password**: *test*

### Test with 3 fresh nodes

    $ npm run clean:server:test
    $ npm run play

Then you will get access to the three nodes at `http://localhost:900{1,2,3}` with the `root` as username and `test{1,2,3}` for the password.

### Other commands

To print all available command run:

    $ npm run help

## Contributing

See the [contributing guide](https://github.com/Chocobozzz/PeerTube/blob/master/.github/CONTRIBUTING.md).

See the [server code documentation](https://github.com/Chocobozzz/PeerTube/blob/master/support/doc/server/code.md).

See the [client code documentation](https://github.com/Chocobozzz/PeerTube/blob/master/support/doc/client/code.md).


## Architecture

See [ARCHITECTURE.md](https://github.com/Chocobozzz/PeerTube/blob/master/ARCHITECTURE.md) for a more detailed explication.

### Backend

  * The backend is a REST API
  * Servers communicate with each others with [Activity Pub](https://www.w3.org/TR/activitypub/)
  * Each server has its own users who query it (search videos, where the torrent URI of this specific video is...)
  * If a user upload a video, the server seeds it and sends the video information (name, short description, torrent URI...) its followers
  * A server is a tracker responsible for all the videos uploaded in it
  * Even if nobody watches a video, it is seeded by the server (through [WebSeed protocol](http://www.bittorrent.org/beps/bep_0019.html)) where the video was uploaded

Here are some simple schemes:

<p align="center">

<img src="https://lutim.cpy.re/6Qut3ure.png" alt="Decentralized" />

<img src="https://lutim.cpy.re/NvRAcv6U.png" alt="Watch a video" />

<img src="https://lutim.cpy.re/pqKm3Q5S.png" alt="Watch a P2P video" />

</p>
