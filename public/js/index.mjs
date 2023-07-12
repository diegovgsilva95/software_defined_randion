import websocketEvents from "./websocket_client.mjs"
import { mapNumber } from "./utils.mjs"

var canvas = document.querySelector("canvas"),
    W = canvas.width = 1280,
    H = canvas.height = 480,
    ctx = canvas.getContext("2d"),

    canvasData = {
        byteCount: 256,
        bytes: [],
        totalBytes: 0,
        maxBytes: 0,
        addOctet: function(octet){
            canvasData.bytes[octet]++
            canvasData.totalBytes++
            canvasData.maxBytes = Math.max(canvasData.maxBytes, canvasData.bytes[octet])
        },
        reset: function(){
            canvasData.totalBytes = 0
            canvasData.maxBytes = 0
            canvasData.bytes = Array.from(Array(canvasData.byteCount)).fill(0)
        }
    },
    canvasDraw = function(){
        
        let barWidth = W/canvasData.byteCount
        
        ctx.fillStyle = "#111"
        ctx.fillRect(0,0,W,H)

        ctx.fillStyle = "#0F0"
        ctx.strokeStyle = "#0f0"
        
        ctx.beginPath()
        ctx.moveTo(0, H)

        for(let [idx, byteCount] of Object.entries(canvasData.bytes)){
            idx = +idx

            let y = (H - 10) * byteCount / canvasData.maxBytes,
                x = barWidth * idx

            ctx.lineTo(x, H-y-1)
        }
        ctx.stroke()
        ctx.fill()
        setTimeout(canvasDraw, 1000/25)
    }
canvasData.reset()

websocketEvents.on("data", /** @param {ArrayBuffer} data */ function(data){
    let buf = new Int16Array(data)
    canvasData.reset()
    for(let octet of buf)
        canvasData.addOctet(Math.floor(mapNumber(octet, -32768, 32767, 0, 255)))
})

canvasDraw()