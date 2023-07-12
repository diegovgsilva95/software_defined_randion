
export function mapNumber(v, fn, fx, tn, tx, constrain = true){
    if(fx == fn) 
        return v < fn ? tn : tx;

    v = (v - fn) / (fx - fn);
    
    if(constrain) 
        v = Math.min(1, Math.max(0, v));
        
    return ((v * (tx - tn)) + tn);
}