import { Router } from "express";
import { carritoModel } from "../models/carrito.model.js";
import { CartManager } from "../class/CarritoManager.js";

const route = Router()

route.get('/', async (req, res ) => {
    const result = await carritoModel.find().populate('productos.producto') // referencia del carrito
    res.json({result})
})

router.post('/', async (req, res) => {
    const newCart = await carritoModel.create({
        products: []
    })

    res.status(201).json({ message: 'Guardado', cart: newCart })
});




router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
	
    const cartFinded = await carritoModel.findById(cid).populate('products.product');

    const status = cartFinded ? 200 : 404;

    res.status(status).json({ productList: cartFinded?.products });
});





/*route.put ('/:idCarrito/:idProducto',...*/


router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body

    const cartFinded = await cartModel.findById(cid).lean();
    if(!cartFinded) res.status(404).json({ message: 'error' });

    const newCart = {
        ...cartFinded,
        products
    }
    const cartUpdated = await cartModel.findByIdAndUpdate(cid,newCart, {
        new: true,
    }).populate('products.product')

    res.status(201).json({ message: 'Products clean', cart: cartUpdated})

});


router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    const cartFinded = await cartModel.findById(cid).lean();
    if(!cartFinded) res.status(404).json({ message: 'error' });

    const newCart = {
        ...cartFinded,
        products: []
    }
    const cartUpdated = await cartModel.findByIdAndUpdate(cid,newCart, {
        new: true,
    })

    res.status(201).json({ message: 'Products clean', cart: cartUpdated})

});
/* */

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    const cartFinded = await carritoModel.findById(cid);
    if(!cartFinded) res.status(404).json({ message: 'error' });

    const indexProd = cartFinded.products.findIndex(prod => prod.product.toString() === pid);
    if(indexProd === -1){
        cartFinded.products.push({ product: pid, quantity: 1 })
    } else {
        cartFinded.products[indexProd] = { product: cartFinded.products[indexProd].product, quantity: cartFinded.products[indexProd].quantity + 1 }
    }
    const cartUpdated = await carritoModel.findByIdAndUpdate(cid,cartFinded, {
        new: true,
    }).populate('products.product')

    res.status(201).json({ message: 'Product Added', cart: cartUpdated})

});

router.put('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cartFinded = await carritoModel.findById(cid).lean();
    if(!cartFinded) res.status(404).json({ message: 'error' });

    const indexProd = cartFinded.products.findIndex(prod => prod.product.toString() === pid);
    
    cartFinded.products[indexProd] = { ...cartFinded.products[indexProd], quantity }
    
    const cartUpdated = await carritoModel.findByIdAndUpdate(cid,cartFinded, {
        new: true,
    }).populate('products.product')

    res.status(201).json({ message: 'Product Quantity Modify', cart: cartUpdated })

});

router.delete('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    const cartFinded = await carritoModel.findById(cid).lean();
    if(!cartFinded) res.status(404).json({ message: 'error' });

    const cartFiltered = {
        ...cartFinded,
        products:  cartFinded.products.filter(prod => prod.product.toString() !== pid)
    }

    const cartUpdated = await carritoModel.findByIdAndUpdate(cid,cartFiltered, {
        new: true,
    }).populate('products.product')

    res.status(201).json({ message: 'Product deleted', cart: cartUpdated})
});


export default route