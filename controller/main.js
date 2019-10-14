const editor = require('./quilleditor.js');

// TODO: Basic function (local insert, del, format)
// TODO: Share session by link
// TODO: change event handling quill.on method

const signalhub = require('signalhub');
const swarm = require('webrtc-swarm');
const hub = signalhub('app', [
  'https://handshakesignalserver.herokuapp.com/',
]);
const sw = swarm(hub, {});
const cursor = editor.getModule('cursors');

// const animals = [
//   'leopard', 'rooster', 'kiwi', 'bear', 'deer', 'swan', 'bull',
//   'python', 'panda', 'beetle', 'eagle', 'dolphin', 'beaver', 'koala',
//   'frog',
// ];

// const colors = [
//   'black', 'silver', 'gray', 'maroon', 'red', 'purple',
//   'fuchsia', 'green', 'lime', 'olive', 'yellow', 'navy', 'blue',
//   'teal', 'aqua', 'orange',
// ];

console.log(sw);
// cursor.createCursor(sw.me, sw.me, 'black');
// peerArr.push(sw.me)

sw.on('peer', function(peer, id) {
  // const color = colors[Math.floor(Math.random()*colors.length)];
  // const animal = animals[Math.floor(Math.random()*animals.length)];
  // const name = color + animal;
  // console.log(id + name + color)
  const color = stringToColor(id);
  cursor.createCursor(id, id, color);
  updatePeerList(id);
  peer.on('data', function(data) {
    const delta = JSON.parse(data);
    if (delta.id) {
      cursor.moveCursor(delta.id, delta.range);
    } else {
      editor.updateContents(delta, 'api');
    }
  });
});

sw.on('disconnect', function(peer, id) {
//   if (players[id]) {
//    players[id].element.parentnode.removechild(players[id].element)
//    delete players[id]
// }
});

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
};


editor.on('selection-change', function(range, oldRange, source) {
  const data = JSON.stringify({id: sw.me, range: range});
  sw.peers.forEach((peer)=> {
    peer.send(data);
  });
});

editor.on('text-change', function(delta, oldDelta, source) {
  if (source == 'user') {
    const data = JSON.stringify(delta);
    sw.peers.forEach((peer)=> {
      peer.send(data);
    });
  };
});

/**
 * stringToColor
 *
 * @param {string} str
 * @return {undefined}
 */
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}
