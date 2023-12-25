import { Router } from 'express';
import validator from '../middlewares/validator.js';
import { getProduct, getProductById, deleteProduct, createProduct, updateProduct } from '../controllers/products.controller.js';
import {getProductByIdSchema,productSchema} from "../schemas/products.schema.js";

const router = Router();

router.get('/', getProduct);

router.get("/:pid", validator.params(getProductByIdSchema),getProductById);

router.delete("/:pid", validator.params(getProductByIdSchema),deleteProduct);

router.post("/", validator.body(productSchema),createProduct);

router.put("/:pid", validator.params(getProductByIdSchema),validator.body(productSchema),updateProduct);

export default router;