import { productPath } from '../utils.js';

import ProductManager from '../dao/fileManager/products.file.js';
//import ProductManager from "../dao/dbManager/products.db.js"
const productManager= new ProductManager(productPath);

export const getProduct= async () => {
    const products = await productManager.getAll();
    return products;
}

export const getProductById= async (pid) => {
    const product = await productManager.getProductById(pid)
    return product;
}

export const deleteProduct= async (pid) => {
    const result = await productManager.delete(pid);
    return result;
}

export const createProduct= async (product) => {
    const result = await productManager.save(product);
    return result;
}

export const updateProduct= async (pid,product) => {
    const result = await productManager.update(pid,product);
    return result;
}



