class EventEmitter extends EventTarget {
    on(eventName, fn){
        this.addEventListener(eventName, function(ev){
            fn(...ev.detail)
        })
    }
    emit(eventName, ...params){
        this.dispatchEvent(new CustomEvent(eventName, {detail: params}))
    }
}

export default EventEmitter