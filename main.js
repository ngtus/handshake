window.addEventListener("load", () => {
 navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(function (localStream) {
      const signalhub = require('signalhub')
      const swarm = require('webrtc-swarm')


      const Player = require('./player.js')
      //const canvas = require('./canvas')
      
      const hub = signalhub('my-game', [
        'https://handshakesignalserver.herokuapp.com/'
      ])

      const sw = swarm(hub, {
        //stream: localStream
      })

      const localPlayer = new Player()
      localPlayer.addStream(localStream)
      console.log(localStream)

      const players = {}
      sw.on('connect', function (peer, id) {
        if (!players[id]) {
          players[id] = new Player()
         peer.on('data', function (data) {
            data = JSON.parse(data.toString())
            players[id].update(data)
          })
         peer.addStream(localStream)
          console.log(peer)
          peer.on('stream', stream => {
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

      setInterval(function () {
        localPlayer.update()
        const localPlayerString = JSON.stringify(localPlayer)
        sw.peers.forEach(peer => {
          peer.send(localPlayerString)
        })
      }, 100)

      document.addEventListener('keypress', function (e) {
        const speed = 16
        switch (e.key) {
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
      }, false)

    })
})
