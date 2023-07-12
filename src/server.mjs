import https from "https"
import { readFile } from "fs/promises"
import { log } from "console"
import { installUpgrade } from "./websocket_server.mjs"

export default async function createServer(expressApp){
    let server =  https.createServer({
        cert: await readFile(process.env.HTTPS_CERT_FILE, "utf-8"),
        key: await readFile(process.env.HTTPS_KEY_FILE, "utf-8"),
    }, expressApp)
    
    process.on("SIGINT", function(){
        log("[HTTPS] Closing server...")
        server.close()
    })
    server.listen(8880)
    installUpgrade(server)

    return server
}

