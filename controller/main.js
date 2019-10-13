const editor = require('./quilleditor.js');

// TODO: Basic function (local insert, del, format)
// TODO: Share session by link

const signalhub = require('signalhub');
const swarm = require('webrtc-swarm');
const hub = signalhub('app', [
  'https://handshakesignalserver.herokuapp.com/',
]);
const sw = swarm(hub, {});

/* const peerArr = []; */
// const animals = [
//   'leopard', 'rooster', 'kiwi', 'bear', 'deer', 'swan', 'bull',
//   'python', 'panda', 'beetle', 'eagle', 'dolphin', 'beaver', 'koala', 'frog',
// ];
// const colors = [
//   'white', 'silver', 'gray', 'black', 'red', 'maroon', 'yellow', 'olive',
//   'lime', 'green', 'aqua', 'teal', 'blue', 'navy', 'fuchsia', 'purple',
//   'pink',
/* ]; */


console.log('me: ' + sw.me);
// peerArr.push(sw.me)

sw.on('connect', function(peer, id) {
  updatePeerList(id);
  peer.on('data', function(data) {
    const change = JSON.parse(data);
    console.log('received from ' + id + ': ' + data);
    editor.insertText(change.index, change.text, 'api');
  });
});

sw.on('disconnect', function(peer, id) {
//   if (players[id]) {
//    players[id].element.parentnode.removechild(players[id].element)
//    delete players[id]
// }
});

document.addEventListener('keypress', (event) => {
  const localString = String.fromCharCode(event.which);
  console.log(localString);
  /*  const localPlayerString = JSON.stringify(localPlayer)*/
  const range = editor.getSelection();
  sw.peers.forEach((peer )=> {
    const localChange = {index: range.index, text: localString};
    const localChangeString = JSON.stringify(localChange);
    console.log(localChangeString);
    peer.send(localChangeString);
  });
}, false);

/**
 * updatePeerList
 *
 * @param {number} id
 * @return {undefined}
 */
function updatePeerList(id) {
  const item = document.createElement('a');
  const peerName = document.createTextNode(id + ';');
  item.appendChild(peerName);
  document.getElementById('peerList').appendChild(item);
}
