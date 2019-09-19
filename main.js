const editor = require('./editor.js')

const signalhub = require('signalhub')
const swarm = require('webrtc-swarm')
const hub = signalhub('app', [
  'https://handshakesignalserver.herokuapp.com/'
])
const sw = swarm(hub, {})

sw.on('connect', function (peer, id) {
  console.log('connected')
  peer.on('data', function (data) {
    //updateCanvas(data)
    console.log('recevied: ')
    console.log(data)
  })
})

sw.on('disconnect', function (peer, id) {
/*  if (players[id]) {*/
    //players[id].element.parentNode.removeChild(players[id].element)
    //delete players[id]
  /*}*/
})

document.addEventListener('keypress', event => {
  let localString = String.fromCharCode(event.which)
/*  const localPlayerString = JSON.stringify(localPlayer)*/
  sw.peers.forEach(peer => {
    peer.send(localString)
  })
}, false)


