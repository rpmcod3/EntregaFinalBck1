import { Router } from "express";
import { __dirname } from '../utils.js';
import { ProductManager } from "../class/ProductManager.js";



const route = Router();
const productList = new ProductManager('productos.producto');



router.get('/', async (req, res) => {
    const list = await productList.getProducts();

    res.render('index', { list })
});

router.get('/carts/:cid', (req, res) => {
	const { cid } = req.params
	res.render('carts', {
		cid
	})
})

router.get('/products', (req, res) => {
    res.render('products')
})


export default route
