import { Router } from 'express';
import { createCart, getCart,updateCart,deleteCart,deleteProductFromCart,addProductToCart,updateProductInCart} from '../controllers/carts.controller.js';
import {updateProductInCartSchema, updateFullCartSchema,getCartByIdSchema,productCartSchema} from "../schemas/carts.schema.js"
import validator from '../middlewares/validator.js';

const router = Router();

router.get("/:cid",validator.params(getCartByIdSchema), getCart);

router.post('/', createCart);

router.post('/:cid/product/:pid',validator.params(productCartSchema), addProductToCart);

router.delete("/:cid", validator.params(getCartByIdSchema),deleteCart);

router.delete('/:cid/product/:pid', validator.params(productCartSchema),deleteProductFromCart);
        
router.put("/:cid",validator.params(getCartByIdSchema),validator.body(updateFullCartSchema), updateCart);

router.put('/:cid/product/:pid',validator.params(productCartSchema),validator.body(updateProductInCartSchema), updateProductInCart);

export default router;