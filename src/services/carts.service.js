//import CartManager from "../dao/dbManager/carts.db.js";
//import CartManager from '../dao/fileManager/carts.file.js';
import { CartManager,TicketManager } from '../dao/factory.js';
import { cartPath} from '../utils.js';
import  CartManagerRepository  from '../repositories/carts.repository.js';
import  TicketManagerRepository  from '../repositories/tickets.repository.js';
const cartManager = new CartManager(cartPath);
const cartManagerRepository= new CartManagerRepository(cartManager);
const ticketManager = new TicketManager();
const ticketManagerRepository= new TicketManagerRepository(ticketManager);

const notEnoughStock = (quantity,stock) =>{
    return quantity>stock;
}

export const createCart= async () => {
    const result = await cartManagerRepository.saveRepository();
    return result;
}

export const getCart= async (cid) => {
    const cart = await cartManagerRepository.getCartByIdRepository(cid)
    return cart;
}
export const updateCart= async (cid,pid,quantity=1) => {
    const cart = await cartManagerRepository.getCartByIdRepository(cid)
    if (cart.products.length===0){
        cart.products.push({"product":pid,"quantity":quantity}) //Problema acá y en línea 35 al usar file.
    } else{
    //const indexProductInCart = cart.products.findIndex(product=>product.product===pid)
    const indexProductInCart = cart.products.findIndex(product=>product.product._id.toString()===pid)
        if (indexProductInCart!==-1){
            cart.products[indexProductInCart].quantity+=quantity;
                } else {
                    cart.products.push({"product":pid,"quantity":quantity});
                };
            }        
    const result = await cartManagerRepository.updateRepository(cid,{"products": cart.products});
    return result;
}

export const updateFullCart= async (cid,products) => {    
    const result = await cartManagerRepository.updateRepository(cid,{"products": products});
    return result;
}

export const deleteCart= async (cid) => {
    const result = await cartManagerRepository.updateRepository(cid,{"products": []});
    return result;
}

export const deleteProductFromCart= async (cid,pid) => {
    const cart = await cartManagerRepository.getCartByIdRepository(cid);
    if (cart.products.length!==0){
        //const indexProductInCart = cart.products.findIndex(product=>product.product===pid)
        const indexProductInCart = cart.products.findIndex(product=>product.product._id.toString()===pid)
    if (indexProductInCart!==-1){
                cart.products.splice(indexProductInCart,1);
                    } 
        }     
    const result = await cartManagerRepository.updateRepository(cid,{"products": cart.products});
    return result;
}

export const purchase = async (cid,user) => {
    const cart = await cartManagerRepository.getCartByIdRepository(cid);
    const products = cart.products;
    console.log(products)
    const orderNumber = Date.now() + Math.floor(Math.random() * 100000 + 1);
    const ticket ={
        "code": orderNumber,
        "purchase_datetime": new Date(),
        "amount":15000,
        "purchaser": user.email
    }
    const result = await ticketManagerRepository.saveRepository(ticket);
    return result;
}

    

// export const updateCart= async (cid,pid,quantity=1,stock) => {
//     if (notEnoughStock(quantity,stock)){
//         return ("Not enough stock")
//     }
//     const cart = await cartManager.getCartById(cid)
//     if (cart.products.length===0){
//         cart.products.push({"product":pid,"quantity":quantity}) //Problema acá y en línea 35 al usar file.
//     } else{
//     //const indexProductInCart = cart.products.findIndex(product=>product.product===pid)
//     const indexProductInCart = cart.products.findIndex(product=>product.product._id.toString()===pid)
//         if (indexProductInCart!==-1){
//             cart.products[indexProductInCart].quantity+=quantity;
//             const result = await cartManager.update(cid,{"products": cart.products});
//             return result;
//                 } else {
//                     cart.products.push({"product":pid,"quantity":quantity});
//                 };
//             }    
//     const result = await cartManager.updateOne(cid,pid,cart.products);
//     return result;
// }
