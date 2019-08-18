      window.addEventListener("load", () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (stream) {
      const signalhub = require('signalhub')
      const swarm = require('webrtc-swarm')


      const Player = require('./player.js')
      const canvas = require('./canvas')
      const hub = signalhub('my-game', [
        'https://handshakesignalserver.herokuapp.com/'
      ])
      const sw = swarm(hub, {
        stream: stream
      })

      const you = new Player()
      you.addStream(stream)
      console.log(stream)

sw.on('peer', function (peer, id) {
  console.log('connected to a new peer:', id)
  console.log('total peers:', sw.peers.length)
  console.log(stream)
  console.log(peer.stream)
})

sw.on('disconnect', function (peer, id) {
  console.log('disconnected from a peer:', id)
  console.log('total peers:', sw.peers.length)
})
/*      const players = {}*/
      //sw.on('connect', function (peer, id) {
        //if (!players[id]) {
          //players[id] = new Player()
          //peer.on('data', function (data) {
            //data = JSON.parse(data.toString())
            //players[id].update(data)
          //})
          //players[id].addStream(peer.stream)
        //}
      //})

      //sw.on('disconnect', function (peer, id) {
        //if (players[id]) {
          //players[id].element.parentNode.removeChild(players[id].element)
          //delete players[id]
        //}
      //})

      //setInterval(function () {
        //you.update()
        //const youString = JSON.stringify(you)
        //sw.peers.forEach(peer => {
          //peer.send(youString)
        //})
      //}, 100)

      //document.addEventListener('keypress', function (e) {
        //const speed = 16
        //switch (e.key) {
          //case 'a':
            //you.x -= speed
            //break
          //case 'd':
            //you.x += speed
            //break
          //case 'w':
            //you.y -= speed
            //break
          //case 's':
            //you.y += speed
            //break
        //}
      //}, false)

    })
})
