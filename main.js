const Quill = require('quill')
var toolbarOptions = [
  [{ 'font': [] }],
  [{ 'size': ['small', false, 'large', 'huge'] }],

  ['bold', 'italic', 'underline', 'strike'],        

  [{ 'color': [] }, { 'background': [] }],  

  [{ 'script': 'sub'}, { 'script': 'super' }],      

  [{ 'header': 1 }, { 'header': 2 }],              
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  ['blockquote', 'code-block'],

  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],        

  [{ 'direction': 'rtl' }],                      
  [{ 'align': [] }],
    
  ['link', 'image', 'video', 'formula'],       

  ['clean']  
]

/*var toolbarOptions = [*/
  //['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  //['blockquote', 'code-block'],

  //[{ 'header': 1 }, { 'header': 2 }],               // custom button values
  //[{ 'list': 'ordered'}, { 'list': 'bullet' }],
  //[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  //[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  //[{ 'direction': 'rtl' }],                         // text direction
    
  //// custom dropdown
  //[{ 'size': ['small', false, 'large', 'huge'] }],
  //[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  //// dropdown with defaults from theme
  //[{ 'color': [] }, { 'background': [] }],  
  //[{ 'font': [] }],
  //[{ 'align': [] }],

  //// remove formatting button
  //['clean']  
/*]*/

var quill = new Quill('#editor', {
  modules: {
    toolbar: toolbarOptions
  },
  theme: 'snow'
})
const Player = require('./player.js')
const signalhub = require('signalhub')
const swarm = require('webrtc-swarm')
//const canvas = require('./canvas')
const hub = signalhub('my-game', [
  'https://handshakesignalserver.herokuapp.com/'
])
const sw = swarm(hub, { 
  //opts
})

const canvas = document.querySelector('#canvas') 
const context = canvas.getContext("2d")
//Set canvas size
canvas.height = window.innerHeight
canvas.width = window.innerWidth
//variables 
let painting = false

window.addEventListener("load", () => {
  navigator.mediaDevices.getUserMedia({ video: false, audio: true })
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
          if(data.color){
            players[id].update(data)
          }

          updateCanvas(data)
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

    canvas.addEventListener('mousedown', startPosition)
    canvas.addEventListener('mouseup', finishedPosition)
    canvas.addEventListener('mousemove', draw)

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
function startPosition(e){
    painting = true
    draw(e)
}

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
    peer.send(JSON.stringify({painting: painting, x: e.clientX, y: e.clientY }))
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
