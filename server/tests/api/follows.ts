/* tslint:disable:no-unused-expression */

import * as chai from 'chai'
import 'mocha'

import {
  flushAndRunMultipleServers,
  flushTests,
  getVideosList,
  killallServers,
  ServerInfo,
  setAccessTokensToServers,
  uploadVideo,
  wait
} from '../utils'
import { follow, getFollowersListPaginationAndSort, getFollowingListPaginationAndSort, unfollow } from '../utils/follows'
import { getUserAccessToken } from '../utils/login'
import { dateIsValid, webtorrentAdd } from '../utils/miscs'
import { createUser } from '../utils/users'
import { getVideo, rateVideo, testVideoImage } from '../utils/videos'

const expect = chai.expect

describe('Test follows', function () {
  let servers: ServerInfo[] = []
  let server3Id: number

  before(async function () {
    this.timeout(20000)

    servers = await flushAndRunMultipleServers(3)

    // Get the access tokens
    await setAccessTokensToServers(servers)
  })

  it('Should not have followers', async function () {
    for (const server of servers) {
      const res = await getFollowersListPaginationAndSort(server.url, 0, 5, 'createdAt')
      const follows = res.body.data

      expect(res.body.total).to.equal(0)
      expect(follows).to.be.an('array')
      expect(follows.length).to.equal(0)
    }
  })

  it('Should not have following', async function () {
    for (const server of servers) {
      const res = await getFollowingListPaginationAndSort(server.url, 0, 5, 'createdAt')
      const follows = res.body.data

      expect(res.body.total).to.equal(0)
      expect(follows).to.be.an('array')
      expect(follows.length).to.equal(0)
    }
  })

  it('Should have server 1 following server 2 and 3', async function () {
    this.timeout(10000)

    await follow(servers[0].url, [ servers[1].url, servers[2].url ], servers[0].accessToken)

    await wait(7000)
  })

  it('Should have 2 followings on server 1', async function () {
    let res = await getFollowingListPaginationAndSort(servers[0].url, 0, 1, 'createdAt')
    let follows = res.body.data

    expect(res.body.total).to.equal(2)
    expect(follows).to.be.an('array')
    expect(follows.length).to.equal(1)

    res = await getFollowingListPaginationAndSort(servers[0].url, 1, 1, 'createdAt')
    follows = follows.concat(res.body.data)

    const server2Follow = follows.find(f => f.following.host === 'localhost:9002')
    const server3Follow = follows.find(f => f.following.host === 'localhost:9003')

    expect(server2Follow).to.not.be.undefined
    expect(server3Follow).to.not.be.undefined
    expect(server2Follow.state).to.equal('accepted')
    expect(server3Follow.state).to.equal('accepted')

    server3Id = server3Follow.following.id
  })

  it('Should have 0 followings on server 1 and 2', async function () {
    for (const server of [ servers[1], servers[2] ]) {
      const res = await getFollowingListPaginationAndSort(server.url, 0, 5, 'createdAt')
      const follows = res.body.data

      expect(res.body.total).to.equal(0)
      expect(follows).to.be.an('array')
      expect(follows.length).to.equal(0)
    }
  })

  it('Should have 1 followers on server 2 and 3', async function () {
    for (const server of [ servers[1], servers[2] ]) {
      let res = await getFollowersListPaginationAndSort(server.url, 0, 1, 'createdAt')

      let follows = res.body.data
      expect(res.body.total).to.equal(1)
      expect(follows).to.be.an('array')
      expect(follows.length).to.equal(1)
      expect(follows[0].follower.host).to.equal('localhost:9001')
    }
  })

  it('Should have 0 followers on server 1', async function () {
    const res = await getFollowersListPaginationAndSort(servers[0].url, 0, 5, 'createdAt')
    const follows = res.body.data

    expect(res.body.total).to.equal(0)
    expect(follows).to.be.an('array')
    expect(follows.length).to.equal(0)
  })

  it('Should unfollow server 3 on server 1', async function () {
    this.timeout(5000)

    await unfollow(servers[0].url, servers[0].accessToken, server3Id)

    await wait(3000)
  })

  it('Should not follow server 3 on server 1 anymore', async function () {
    const res = await getFollowingListPaginationAndSort(servers[0].url, 0, 2, 'createdAt')
    let follows = res.body.data

    expect(res.body.total).to.equal(1)
    expect(follows).to.be.an('array')
    expect(follows.length).to.equal(1)

    expect(follows[0].following.host).to.equal('localhost:9002')
  })

  it('Should not have server 1 as follower on server 3 anymore', async function () {
    const res = await getFollowersListPaginationAndSort(servers[2].url, 0, 1, 'createdAt')

    let follows = res.body.data
    expect(res.body.total).to.equal(0)
    expect(follows).to.be.an('array')
    expect(follows.length).to.equal(0)
  })

  it('Should upload a video on server 2 ans 3 and propagate only the video of server 2', async function () {
    this.timeout(10000)

    await uploadVideo(servers[1].url, servers[1].accessToken, { name: 'server2' })
    await uploadVideo(servers[2].url, servers[2].accessToken, { name: 'server3' })

    await wait(5000)

    let res = await getVideosList(servers[0].url)
    expect(res.body.total).to.equal(1)
    expect(res.body.data[0].name).to.equal('server2')

    res = await getVideosList(servers[1].url)
    expect(res.body.total).to.equal(1)
    expect(res.body.data[0].name).to.equal('server2')

    res = await getVideosList(servers[2].url)
    expect(res.body.total).to.equal(1)
    expect(res.body.data[0].name).to.equal('server3')
  })

  it('Should propagate previous uploaded videos on a new following', async function () {
    this.timeout(20000)

    const video4Attributes = {
      name: 'server3-4',
      category: 2,
      nsfw: true,
      licence: 6,
      tags: [ 'tag1', 'tag2', 'tag3' ]
    }

    await uploadVideo(servers[2].url, servers[2].accessToken, { name: 'server3-2' })
    await uploadVideo(servers[2].url, servers[2].accessToken, { name: 'server3-3' })
    await uploadVideo(servers[2].url, servers[2].accessToken, video4Attributes)
    await uploadVideo(servers[2].url, servers[2].accessToken, { name: 'server3-5' })
    await uploadVideo(servers[2].url, servers[2].accessToken, { name: 'server3-6' })

    {
      const user = { username: 'captain', password: 'password' }
      await createUser(servers[2].url, servers[2].accessToken, user.username, user.password)
      const userAccessToken = await getUserAccessToken(servers[2], user)

      const res = await getVideosList(servers[2].url)
      const video4 = res.body.data.find(v => v.name === 'server3-4')

      await rateVideo(servers[2].url, servers[2].accessToken, video4.id, 'like')
      await rateVideo(servers[2].url, userAccessToken, video4.id, 'dislike')
    }

    await wait(5000)

    // Server 1 follows server 3
    await follow(servers[0].url, [ servers[2].url ], servers[0].accessToken)

    await wait(7000)

    let res = await getVideosList(servers[0].url)
    expect(res.body.total).to.equal(7)

    const video2 = res.body.data.find(v => v.name === 'server3-2')
    const video4 = res.body.data.find(v => v.name === 'server3-4')
    const video6 = res.body.data.find(v => v.name === 'server3-6')

    expect(video2).to.not.be.undefined
    expect(video4).to.not.be.undefined
    expect(video6).to.not.be.undefined

    const res2 = await getVideo(servers[0].url, video4.id)
    const videoDetails = res2.body

    expect(videoDetails.name).to.equal('server3-4')
    expect(videoDetails.category).to.equal(2)
    expect(videoDetails.categoryLabel).to.equal('Films')
    expect(videoDetails.licence).to.equal(6)
    expect(videoDetails.licenceLabel).to.equal('Attribution - Non Commercial - No Derivatives')
    expect(videoDetails.language).to.equal(3)
    expect(videoDetails.languageLabel).to.equal('Mandarin')
    expect(videoDetails.nsfw).to.be.ok
    expect(videoDetails.description).to.equal('my super description')
    expect(videoDetails.serverHost).to.equal('localhost:9003')
    expect(videoDetails.account).to.equal('root')
    expect(videoDetails.likes).to.equal(1)
    expect(videoDetails.dislikes).to.equal(1)
    expect(videoDetails.isLocal).to.be.false
    expect(videoDetails.tags).to.deep.equal([ 'tag1', 'tag2', 'tag3' ])
    expect(dateIsValid(videoDetails.createdAt)).to.be.true
    expect(dateIsValid(videoDetails.updatedAt)).to.be.true
    expect(videoDetails.files).to.have.lengthOf(1)

    const file = videoDetails.files[0]
    const magnetUri = file.magnetUri
    expect(file.magnetUri).to.have.lengthOf.above(2)
    expect(file.torrentUrl).to.equal(`${servers[2].url}/static/torrents/${videoDetails.uuid}-${file.resolution}.torrent`)
    expect(file.fileUrl).to.equal(`${servers[2].url}/static/webseed/${videoDetails.uuid}-${file.resolution}.webm`)
    expect(file.resolution).to.equal(720)
    expect(file.resolutionLabel).to.equal('720p')
    expect(file.size).to.equal(218910)

    const test = await testVideoImage(servers[2].url, 'video_short.webm', videoDetails.thumbnailPath)
    expect(test).to.equal(true)

    const torrent = await webtorrentAdd(magnetUri)
    expect(torrent.files).to.be.an('array')
    expect(torrent.files.length).to.equal(1)
    expect(torrent.files[0].path).to.exist.and.to.not.equal('')
  })

  after(async function () {
    killallServers(servers)

    // Keep the logs if the test failed
    if (this['ok']) {
      await flushTests()
    }
  })
})
