export function saveLocal(id, key, value) {
    
    let seller = localStorage._seller_;
    if (!seller) {
        seller = {};
        seller[id] = {};
    } else {
        seller = JSON.parse(seller);
        if (!seller[id]) {
            seller[id] = {};
        }
    }
    seller[id][key] = value;
    window.localStorage._seller_ = JSON.stringify(seller);
    console.log(localStorage)
}

export function loadFromLocal(id,key,def) {
    // window.localStorage 数据是字符串
    let seller = window.localStorage._seller_;
    // 判断本地存储的_seller_是否存在
    if(!seller) {
        return def;
    }
    seller = JSON.parse(seller)[id];
    // 判断商家是否存在
    if(!seller) {
        return def;
    }
    let det = seller[key]; // true/false
    return det || def;
}