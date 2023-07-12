import { log } from "console"
import { createHash } from "crypto"
import { readFile, readdir, stat } from "fs/promises"
import * as path from "path"
import express from "express"

var route = express.Router(),
    statsWithoutAccess = async function(filepath){
        let stats = {...await stat(filepath)}
        delete stats.atime
        delete stats.atimeMs
        return stats
    },
    mapDir = async function(mapPath = "./public", level = 0){
        if(level > 10) {
            log("[Live reload] Warning: Detected deephole. Exiting.")
            return [];
        }
        let hashes = [],
            itens = await readdir(mapPath, {
            encoding: "utf8",
            withFileTypes: true
        })
        
        for(let item of itens){
            let filepath = path.join(mapPath, item.name)

            if(item.isDirectory() && item.name != "node_modules")
                hashes.push(...(await mapDir(filepath, level++)))
            else if(item.isFile())
                hashes.push(createHash("md5").update(JSON.stringify(await statsWithoutAccess(filepath))).digest("hex"))
        }
        return hashes
    },
    lastMapped = 0,
    lastHash = null


route.use(async function(req, res){
    if(lastHash == null || (Math.abs(Date.now() - lastMapped) >= 1500)){
        log(`[Live reload] Recalculating...`)
        lastMapped = Date.now()
        let hash = null
        try {
            hash = createHash("md5").update(JSON.stringify(await mapDir())).digest("hex")
        } catch(e){
            log(`[Live reload] Error while calculating hashes.`, e)
            res.end("")
            return
        }
        lastHash = hash
    } else {
        log(`[Live reload] Reusing last hash`)
        res.setHeader("X-Reusing-Hash", true)
    }

    res.end(lastHash)
})


export default route