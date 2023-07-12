import "dotenv/config"
import { stdout } from "process"
import express from "express"
import createServer from "./src/server.mjs"

stdout.write(`\x1b[H\x1b[3J\x1b[2J`)

var app = express(),
    server = await createServer(app)

app.use("/",           (await import("./routes/public.mjs")).default)
app.use("/has_update", (await import("./routes/live_reload.mjs")).default)

await import("./src/sdr_fm.mjs")