var lastHash = null,
    checkingDelay = 500,
    checkUpdate = async function(){
        let hash = "",
            triggerRefresh = false
        try {
            hash = await (await fetch("/has_update")).text()
            if(lastHash == null)
                lastHash = hash
            else if(lastHash != hash)
                triggerRefresh = true
            
        } catch(e){
            console.log("[Live reload] Server probably restarting... Ignore.")
        }

        if(triggerRefresh){
            console.log("[Live reload] Changes detected, reloading...")
            location.reload(true)
        } else
            setTimeout(checkUpdate, checkingDelay)
    }

if(!("live" in window)){
    console.log("[Live reload] Live reload implanted!")
    window.live = setTimeout(checkUpdate, checkingDelay)
} else {
    console.warn("[Live reload] Ignoring re-declaration of live reload (and there's some serious error regarding your module system, this daemon shoudn't be invoked twice).")
}