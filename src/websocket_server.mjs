import { log } from "console"
import * as https from "https"
import { WebSocketServer } from "ws"

var wss = new WebSocketServer({
        noServer: true
    }),
    wssClients = {},
    installUpgrade = /** @param {https.Server} server */function(server){
        server.on("upgrade", function(request, socket, head){
            wss.handleUpgrade(request, socket, head, function(ws){
                wss.emit("connection", ws, request);
            })
        })
    },
    broadcastData = function(data){
        for(let [id, client] of Object.entries(wssClients))
            client.ws.send(data)
    }

wss.on("connection", function(ws, request){
    let clientId = Date.now().toString(16)
    log(`[WebSocket] Client ${clientId}: New client connection.`)
    wssClients[clientId] = {ws, request}

    ws.on("error", function(err){
        console.error(`[WebSocket] Client ${clientId}: Error. `, err)
        delete wssClients[clientId]
    })
    ws.on("close", function(code, reason){
        console.log(`[WebSocket] Client ${clientId}: Closed connection with code ${code} and reason ${reason}.`)
        delete wssClients[clientId]
    })
    ws.on("message", function(data){
        console.log(`[WebSocket] Client ${clientId}: Received data. `, data)
    })
})

export {wss, wssClients, installUpgrade, broadcastData}