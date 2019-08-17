    const canvas = document.querySelector('#canvas') 
    const context = canvas.getContext("2d")

    //Set canvas size
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth

    //variables 
    let painting = false

    function startPosition(e){
        painting = true
        draw(e)
    }

    function finishedPosition(){
        painting = false
        context.beginPath()
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

        setInterval(function () {
          let drawCoord = { x: e.clientX, y: e.clientY }
          const drawString  = JSON.stringify(drawCoord)

          swarm.peers.forEach(function (peer) {
            peer.send(drawString)
          })
        }, 100)
    }

    canvas.addEventListener('mousedown', startPosition)
    canvas.addEventListener('mouseup', finishedPosition)
    canvas.addEventListener('mousemove', draw)
    
    peer.on('data', function (data) {
      data = JSON.parse(data.toString())
      updateCanvas(data)
    })

function updateCanvas(data){
  data = data || {}
  xCoord = data.x 
  yCoord = data.y
   
  context.lineWidth = 9
  context.lineCap = "round"
  context.strokeStyle = "black"

  context.lineTo(xCoord, yCoord)
  context.stroke()
  context.beginPath()
  context.moveTo(xCoord, yCoord)

}
