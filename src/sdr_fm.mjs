import * as cp from "child_process"
import { SIGKILL } from "constants"
import { broadcastData } from "./websocket_server.mjs"
import { log } from "console"

var sdr_freq = 99900, // in kHz
    sdr_bw = 48, // also in kHz
    sdr_comm = `-f ${sdr_freq.toFixed(0)}k -s ${sdr_bw.toFixed(0)}k -M wfm -p 30 -l 0 -m 900k`.split(" "),
    sdr = cp.spawn("rtl_fm", sdr_comm, {
        stdio: "pipe"
    })

sdr.stderr.on("data", data => {
    log("[SDR Radio] Incoming error log: ")
    let lines = data.toString("utf8").trim().split("\n")
    for(let line of lines)
        log("[SDR Radio] \t" + line)
    
})
sdr.stdout.on("data", data => {
    log(`[SDR Radio] Incoming RTL samples: ${data.length} bytes`)
    broadcastData(data)
})
sdr.on("close", code => {
    log(`[SDR Radio] Gone with exit code ${code}.`)
})
process.on("SIGINT", function(){
    log("[SDR Radio] Forcing exit...")
    sdr.kill(SIGKILL)
    process.exit(1)
})
