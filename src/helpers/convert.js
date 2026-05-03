export function handleSelect(obj) {
    if (obj?.label) { // handle jika ada label
        return obj.value
    } else if (obj == undefined) { // handle undefined
        return ""
    } else {
        return obj
    }
}


export function handleDecimal(obj2) {
    let obj = parseFloat(obj2)
    if(Math.round(obj) !== obj) {
        obj = obj.toFixed(4);
    }
    return parseFloat(obj) 
}

export function handleDecimalCeil(obj2) {
    let obj = parseFloat(obj2)
    if(Math.ceil(obj) !== obj) {
        obj = obj.toFixed(2);
    }
    return parseFloat(obj) 
}


export function handleDecdiv(obj2) {
    let obj = parseFloat(obj2) / 10000
    if(Math.round(obj) !== obj) {
        obj = obj.toFixed(4);
    }
    return parseFloat(obj) 
}

