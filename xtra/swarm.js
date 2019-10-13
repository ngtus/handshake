const Player = require('./player.js');
const signalhub = require('signalhub');
const swarm = require('webrtc-swarm');
const hub = signalhub('my-game', [
  'https://handshakesignalserver.herokuapp.com/',
]);
const sw = swarm(hub, { /* opts */ });

sw.on('connect', function(peer, id) {
  if (!players[id]) {
    players[id] = new Player();
    peer.on('data', function(data) {
      data = JSON.parse(data.toString());
      if (data.color) {
        players[id].update(data);
      }
      updateCanvas(data);
    });

    peer.addStream(localStream);
    peer.on('stream', (stream )=> {
      console.log('received stream from: ', id);
      console.log(stream);
      players[id].addStream(stream);
    });
  };
});

sw.on('disconnect', function(peer, id) {
  if (players[id]) {
    players[id].element.parentNode.removeChild(players[id].element);
    delete players[id];
  }
});

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('mousemove', draw);

document.addEventListener('keypress', (event )=> {
  const speed = 16;
  switch (event.key) {
    case 'a':
      localPlayer.x -= speed;
      break;
    case 'd':
      localPlayer.x += speed;
      break;
    case 'w':
      localPlayer.y -= speed;
      break;
    case 's':
      localPlayer.y += speed;
      break;
  };

  localPlayer.update();
  const localPlayerString = JSON.stringify(localPlayer);
  sw.peers.forEach(peer => {
    peer.send(localPlayerString);
  });
}, false);

function startPosition(e){
  painting = true;
  draw(e);
};

function finishedPosition(){
  painting = false
  context.beginPath()
  sw.peers.forEach(peer => {
    peer.send(JSON.stringify({painting: painting}))
  })
}


function draw(e){
    if (!painting) return
    context.lineWidth = 9
    context.lineCap = "round"
    context.strokeStyle = "black"

    context.lineTo(e.clientX, e.clientY)
    context.stroke()
    context.beginPath()
    context.moveTo(e.clientX, e.clientY)

    sw.peers.forEach(peer => {
      peer.send(JSON.stringify({
        painting: painting, x: e.clientX, y: e.clientY
      }))
    })
}

function updateCanvas(data){
  if (!data.painting){
    context.beginPath()
    return
  } 
  context.lineWidth = 9
  context.lineCap = "round"
  context.strokeStyle = "black"

  context.lineTo(data.x, data.y)
  context.stroke()
  context.beginPath()
  context.moveTo(data.x, data.y)
}
