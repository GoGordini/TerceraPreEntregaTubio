//import CartManager from "../dao/dbManager/carts.db.js";
import CartManager from '../dao/fileManager/carts.file.js';
import { cartPath, productPath} from '../utils.js';

const cartManager = new CartManager(cartPath);

const notEnoughStock = (quantity,stock) =>{
    return quantity>stock;
}

export const createCart= async () => {
    const result = await cartManager.save();
    return result;
}

export const getCart= async (cid) => {
    const cart = await cartManager.getCartById(cid)
    return cart;
}

export const updateCart= async (cid,pid,quantity=1,stock) => {
    if (notEnoughStock(quantity,stock)){
        return ("Not enough stock")
    }
    const cart = await cartManager.getCartById(cid)
    if (cart.products.length===0){
        cart.products.push({"product":pid,"quantity":quantity})
    } else{
    const indexProductInCart = cart.products.findIndex(product=>product.product===pid)
    //const indexProductInCart = cart.products.findIndex(product=>product.product._id.toString()===pid)
        if (indexProductInCart!==-1){
            cart.products[indexProductInCart].quantity+=quantity;
                } else {
                    cart.products.push({"product":pid,"quantity":quantity});
                };
            }        
    const result = await cartManager.update(cid,{"products": cart.products});
    return result;
}

export const updateFullCart= async (cid,products) => {    
    const result = await cartManager.update(cid,{"products": products});
    return result;
}

export const deleteCart= async (cid) => {
    const result = await cartManager.delete(cid);
    return result;
}

export const deleteProductFromCart= async (cid,pid) => {
    const cart = await cartManager.getCartById(cid);
    if (cart.products.length!==0){
        const indexProductInCart = cart.products.findIndex(product=>product.product===pid)
        // const indexProductInCart = cart.products.findIndex(product=>product.product._id.toString()===pid)
    if (indexProductInCart!==-1){
                cart.products.splice(indexProductInCart,1);
                    } 
        }     
    const result = await cartManager.update(cid,{"products": cart.products});
    return result;
}

