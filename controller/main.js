const editor = require('./quilleditor.js');

// TODO: Share session by link
// TODO: Named uuid instead of generated
// TODO: Show loading status
// TODO: Show connection status
// TODO: Update content for new node
// TODO: lseq
// TODO: version vector with exception
//
// ============================================
//
// IDEAS
// - create new tabs and load content into new tabs

const signalhub = require('signalhub');
const swarm = require('webrtc-swarm');

const session = getSession();
const hub = signalhub(session, [
  'https://handshakesignalserver.herokuapp.com/',
]);

const sw = swarm(hub, { });
const cursor = editor.getModule('cursors');

/**
 * getSession
 *
 * @return {string}
 */
function getSession() {
  const urlParams = new URLSearchParams(window.location.search);
  let session = '';
  if (urlParams.has('session')) {
    session = urlParams.get('session');
  } else {
    session = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    document.getElementById('sharingUrl').value = window.location.href + '?session=' + session;
  }
  return session;
}
console.log(sw);
// cursor.createCursor(sw.me, sw.me, 'black');
// peerArr.push(sw.me)

sw.on('connect', function(peer, id) {
  const color = stringToColor(id);
  cursor.createCursor(id, id, color);
  updatePeerList(id);
  peer.on('data', function(data) {
    const parsedData = JSON.parse(data);
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
  // cursor.removeCursor(id);
  removeFromPeerList(id);
});

/**
 * updatePeerList
 *
 * @param {number} id
 * @return {undefined}
 */
function updatePeerList(id) {
  const peers = document.getElementById('peers');
  peers.setAttribute('style', 'color: blue');
  const color = 'background-color: ' + stringToColor(id);
  const li = document.createElement('li');
  const a = document.createElement('a');
  const peerName = document.createTextNode(id);
  a.appendChild(peerName);
  a.setAttribute('style', 'color: white');
  console.log(a)
  li.appendChild(a);
  li.setAttribute('style', color);
  document.getElementById('peerList').appendChild(li);
};

/**
 * removeFromPeerList
 *
 * @param {number} id
 * @return {undefined}
 */
function removeFromPeerList(id) {
  const peers = document.getElementById('peers');
  peers.setAttribute('style', 'color: #777');
  const list = document.getElementById('peerList');
  for (let i = 0; i < list.childNodes.length; i++ ) {
    if (list.childNodes[i].textContent === id) {
      list.removeChild(list.childNodes[i]);
    }
  }
}


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
saveBtn.onclick = function() {
  const content = editor.root.innerHTML;
  const name = 'saveFile.txt';
  const type = 'text/plain';
  const file = new Blob([content], {type: type});
  saveBtn.href = URL.createObjectURL(file);
  saveBtn.download = name;
};

const openBtn = document.getElementById('openBtn');
const inputFile = document.getElementById('inputFile');
openBtn.onclick = function() {
  inputFile.click();
  inputFile.onchange = function(event) {
    handleFiles(inputFile.files);
    // const input = inputFile.files[0];
    // const reader = new FileReader();
    // reader.onload = function() {
    //   const data = reader.result;
    //   console.log(data);
    // };
    // reader.readAsText(input);
  };
};

const dropbox = document.getElementById('container');
dropbox.addEventListener('dragenter', dragenter, false);
dropbox.addEventListener('dragover', dragover, false);
dropbox.addEventListener('drop', drop, false);

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
}

/**
 * handleFiles
 *
 * @param {files} files
 * @return {undefined}
 */
function handleFiles(files) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file.type.startsWith('text/')) {
      continue;
    };

    const reader = new FileReader();
    reader.onload = function() {
      const data = reader.result;
      console.log(data);
      editor.setContents([]);
      editor.clipboard.dangerouslyPasteHTML(0, data, 'api');
    };
    reader.readAsText(file);
  }
}

const copyUrlBtn = document.getElementById('copyUrlBtn');
copyUrlBtn.addEventListener('click', function() {
  const copyText = document.getElementById('sharingUrl');
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand('copy');
});
