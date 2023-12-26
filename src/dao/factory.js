import configs from '../config.js';

const persistence = configs.persistence;

let CartManager;
let ProductManager;
let ChatManager;

switch(persistence) {
    case 'DB':
        console.log('Persistence: DB');
        //Import dinámicos
        //const mongoose = await import('mongoose');
        //await mongoose.connect(configs.mongoUrl); //solo conecta si uso DB
        const { default: ProductsDB } = await import('./dbManager/products.db.js'); //alias del export default class.
        ProductManager = ProductsDB; //exporto el DAO
        const { default: CartsDB } = await import('./dbManager/carts.db.js');
        CartManager = CartsDB;
        const { default: ChatDB } = await import('./dbManager/chat.db.js');
        ChatManager = ChatDB;
        break;
    case 'File':
        console.log('Persistence: File');
        const { default: ProductsFile } = await import('./fileManager/products.file.js');
        ProductManager = ProductsFile;
        const { default: CartsFile } = await import('./fileManager/carts.file.js');
        CartManager = CartsFile;
        const { default: ChatFile} = await import('./fileManager/chat.file.js');
        ChatManager = ChatFile;
        break;
}

export {
    ProductManager,
    CartManager,
    ChatManager
}