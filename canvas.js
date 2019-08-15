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
    }
    canvas.addEventListener('mousedown', startPosition)
    canvas.addEventListener('mouseup', finishedPosition)
    canvas.addEventListener('mousemove', draw)
