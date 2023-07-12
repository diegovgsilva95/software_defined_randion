import EventEmitter from "./event_emitter.mjs"

var ws = null,
    closedByMe = false,
    wsEvents = new EventEmitter(),
    retryConnectWebSocket = function(ms = 500){
        setTimeout(connectWebSocket, ms)
    },
    connectWebSocket = function(){
        try {
            ws = new WebSocket(`wss://${location.host}/`, "radio")
            ws.binaryType = "arraybuffer"
        } catch(e){
            console.error("[WebSocket] Error connecting websocket, retry...")
            retryConnectWebSocket()
            return
        }

        ws.addEventListener("open", function(ev){
            console.info("[WebSocket] Connected to server")
        })
        ws.addEventListener("error", function(ev){
            closedByMe = true
            ws.close()
            console.error("[WebSocket] Error happened, closing and retry a new connection. Error: ", ev)
            retryConnectWebSocket()
        })
        ws.addEventListener("close", function(ev){
            if(closedByMe){
                console.log("[WebSocket] Closed by me, nothing to do.")
                closedByMe = false
            } else {
                console.warn("[WebSocket] Closed unexpectedly, retry a new connection...")
                retryConnectWebSocket()
            }
        })
        
        ws.addEventListener("message", function(ev){
            wsEvents.emit("data", ev.data)
        })
    }

retryConnectWebSocket(10)

export default wsEvents