const editor = require('./editor.js')

//TODO: peerlist 
//TODO: Basic function 
//(w/o crdt localInsert, localDelete, remoteInsert, remoteDelete)
//TODO: Share session by link (generate ID for new one)

const signalhub = require('signalhub')
const swarm = require('webrtc-swarm')
const hub = signalhub('app', [
  'https://handshakesignalserver.herokuapp.com/'
])
const sw = swarm(hub, {})

let peerArr = []
const animals = ['leopard', 'rooster', 'kiwi', 'bear', 'deer', 'swan', 'bull', 'python', 'panda', 'beetle', 'eagle', 'dolphin', 'beaver', 'koala', 'frog']
const colors = ['white', 'silver', 'gray', 'black', 'red', 'maroon', 'yellow', 'olive', 'lime', 'green', 'aqua', 'teal', 'blue', 'navy', 'fuchsia', 'purple', 'pink'] 


console.log('me: ' + sw.me)
//peerArr.push(sw.me)

sw.on('connect', function (peer, id) {
  updatePeerList(id)
  peer.on('data', function (data) {
    let change = JSON.parse(data)
    console.log('received from ' + id + ': ' + data)
    editor.insertText(change.index, change.text, 'api')
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
  console.log(localString)
/*  const localPlayerString = JSON.stringify(localPlayer)*/
  let range = editor.getSelection()
  sw.peers.forEach(peer => {
    let localChange = {index: range.index, text: localString}
    let localChangeString = JSON.stringify(localChange)
    console.log(localChangeString)
    peer.send(localChangeString)
  })
}, false)

function updatePeerList(id){
  let item = document.createElement("a")
  let peerName = document.createTextNode(id + ';')
  item.appendChild(peerName)
  document.getElementById("peerList").appendChild(item)
}
