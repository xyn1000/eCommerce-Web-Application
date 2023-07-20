import request from '@/network/request'

export function createShoppingCart() {
    let shopping_json = JSON.stringify([])
    localStorage.setItem("shoppingCart", shopping_json)
}


export function addPhoneToShoppingCart(title, quantity, img, price, lid, stock) {
    let shopping_cart_str = localStorage.getItem("shoppingCart")
    let shopping_cart_json = JSON.parse(shopping_cart_str)

    // if no listing id, add a new entry. (quantity cannot be negative)
    // else add/subtract quantity, cannot be negative.
    if (shopping_cart_json.length === 0) {
        let jsonObj = {title, quantity, img, price, lid, stock};
        shopping_cart_json.push(jsonObj);
    } else {
        let found = false;
        for (let i = 0; i < shopping_cart_json.length; i++) {

            if (shopping_cart_json[i].lid === lid) {
                //modify quantity
                found = true;
                if (shopping_cart_json[i].quantity + quantity > 0) {
                    // let tmp = Number.parseInt(shopping_cart_json[i].quantity);
                    let before = parseInt(shopping_cart_json[i].quantity);
                    let add = parseInt(quantity);
                    let result = before + add;
                    shopping_cart_json[i].quantity = result;
                } else if (shopping_cart_json[i].quantity + quantity <= 0) {
                    shopping_cart_json.splice(i,1);
                    i--;
                }
            }
        }
        if (!found) {
            let jsonObj = {title, quantity, img, price, lid, stock};
            shopping_cart_json.push(jsonObj);
        }

    }
    let new_shopping_cart_str = JSON.stringify(shopping_cart_json)
    localStorage.setItem("shoppingCart", new_shopping_cart_str)
}


export function getTotalPrice() {
    let shopping_cart = getShoppingCartJSON()
    let total = 0;
    for (let i = 0; i < shopping_cart.length; i++) {
        total += shopping_cart[i].price * parseInt(shopping_cart[i].quantity);
    }
    return total;
}


export function getShoppingCartJSON() {
    let shopping_cart_str = localStorage.getItem("shoppingCart")
    return JSON.parse(shopping_cart_str)
}

export function removePhoneFromShoppingCart(lid) {
    let shopping_cart_str = localStorage.getItem("shoppingCart")
    let shopping_cart_json = JSON.parse(shopping_cart_str)
    for (let i = 0; i < shopping_cart_json.length; i++) {
        console.log(i+": "+shopping_cart_json[i].lid);

        if (shopping_cart_json[i].lid === lid) {
            shopping_cart_json.splice(i,1);
            i--;
        }
    }
    let new_shopping_cart_str = JSON.stringify(shopping_cart_json)
    localStorage.setItem("shoppingCart", new_shopping_cart_str)
}

export function updateNumberDirect(lid,number) {
    let shopping_cart_str = localStorage.getItem("shoppingCart")
    let shopping_cart_json = JSON.parse(shopping_cart_str)
    for (let i = 0; i < shopping_cart_json.length; i++) {
        if (shopping_cart_json[i].lid === lid && number>0) {
            shopping_cart_json[i].quantity=number;
        }else if (number===0){
            shopping_cart_json.splice(i,1);
            i--;
        }
    }
    let new_shopping_cart_str = JSON.stringify(shopping_cart_json)
    localStorage.setItem("shoppingCart", new_shopping_cart_str)
}

export function requestCheckOut(cartObj) {
    return request({
        url: `/api/check-out`,
        method: 'post',
        data: { cart: cartObj }
    })
}
