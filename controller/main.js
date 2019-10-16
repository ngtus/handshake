const editor = require('./quilleditor.js');

// editor.clipboard.dangerouslyPasteHTML(0, content);

// TODO: Share session by link
// TODO: Named uuid instead of generated
// TODO: Double top bar in offline mode
// TODO: Show loading status
// TODO: Show connection status
// TODO: Update content for new node
//
// ============================================
// IDEAS
// - create new tabs and load content into new tabs

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
    const parsedData = JSON.parse(data);
    console.log(parsedData)
    // if (delta.id && delta.source === 'user') {
    if (parsedData.delta) {
      editor.updateContents(parsedData.delta, 'api');
      cursor.moveCursor(parsedData.id, parsedData.range);
    } else {
      cursor.moveCursor(parsedData.id, parsedData.range);
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
  if (source === 'user') {
    console.log('user selection-change');
    const data = JSON.stringify({id: sw.me, range: range});
    sw.peers.forEach((peer)=> {
      peer.send(data);
    });
  } else {
    console.log(source);
    console.log('selection-change');
  };
});

editor.on('text-change', function(delta, oldDelta, source) {
  if (source === 'api') {
    console.log('api text-change');
  } else {
    console.log('user text-change');
    const range = editor.getSelection();
    const data = JSON.stringify({delta: delta, id: sw.me, range: range});
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

const saveBtn = document.getElementById('saveBtn');
saveBtn.onclick = saveFile;

// setTimeout("create('Hello world!', 'myfile.txt', 'text/plain')");

/**
 * create
 *
 * @return {undefined}
 */
function saveFile() {
  const content = editor.root.innerHTML;
  console.log(content);
  const name = 'saveFile.txt';
  const type = 'text/plain';
  const file = new Blob([content], {type: type});
  saveBtn.href = URL.createObjectURL(file);
  saveBtn.download = name;
};

const openBtn = document.getElementById('openBtn');
openBtn.onclick = openFile;

/**
 * openFile
 *
 * @return {undefined}
 */
function openFile() {
  const inputFile = document.getElementById('inputFile');
  inputFile.click();
}

