const signalhub = require('signalhub')
const swarm = require('webrtc-swarm')


const Player = require('./player.js')
const canvas = require('./canvas')
const hub = signalhub('my-game', [
  'https://handshakesignalserver.herokuapp.com/'
])

const sw = swarm(hub, { 
  //opts
})


window.addEventListener("load", () => {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then( localStream => {

    const players = {}
    const localPlayer = new Player()
    localPlayer.addStream(localStream)
    console.log('local stream')
    console.log(localStream)

    sw.on('connect', function (peer, id) {
      if (!players[id]) {
        players[id] = new Player()
        peer.on('data', function (data) {
          data = JSON.parse(data.toString())
          players[id].update(data)
        })

        peer.addStream(localStream)
        peer.on('stream', stream => {
          console.log('received stream from: ', id)
          console.log(stream)
          players[id].addStream(stream)
        })
      }
    })

    sw.on('disconnect', function (peer, id) {
      if (players[id]) {
        players[id].element.parentNode.removeChild(players[id].element)
        delete players[id]
      }
    })

    document.addEventListener('keypress', event => {
      const speed = 16
      switch (event.key) {
        case 'a':
          localPlayer.x -= speed
          break
        case 'd':
          localPlayer.x += speed
          break
        case 'w':
          localPlayer.y -= speed
          break
        case 's':
          localPlayer.y += speed
          break
      }

      localPlayer.update()
      const localPlayerString = JSON.stringify(localPlayer)
      sw.peers.forEach(peer => {
        peer.send(localPlayerString)
      })

    }, false)
  })
})
