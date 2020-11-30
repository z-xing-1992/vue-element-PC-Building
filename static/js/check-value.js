export function isEmpty(value){
    console.log('source',value);
    if(value === null || value === undefined 
        || value === 'null' || value === 'undefined'){
        return true;
    }
    if(Object.keys(value).length<=0){
        return true;
    }
    return false;
}

export function isNotEmpty(value){
    if(isEmpty(value)){
        return false;
    }
    return true;
}
export function formatObject(data){
    let params = [];
   
        if (data) {
            for (let item in data) {
                let vals = data[item];
                if (vals !== undefined) {
                    params.push(item + '=' + data[item])
                }
            }
        }
    return params.length ? '?' + params.join('&') : '';
}