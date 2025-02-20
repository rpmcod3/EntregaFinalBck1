import { Router } from "express";
import CartsManager from "../managers/cartsManager.js";
import { __dirname } from '../utils.js';
import { CartModel } from '../models/Cart.model.js';
import ProductsManager from '../managers/productManager.js';
import { socketServer } from "../index.js";
import { ProductsModel } from "../models/Product.model.js";



const router = Router()
const cartsManager = new CartsManager(__dirname + '/models/carts.json');


router.post('/', async (req, res) => {
    const newCart = await CartModel.create({
        products: [],
    })

    res.status(201).json({ message: 'Guardado', cart: newCart })
});



router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
	
    const cartFinded = await CartModel.findById(cid).populate('products.product').lean();

    const status = cartFinded ? 200 : 404;

    res.status(status).json({ productList: cartFinded?.products });
});


router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body; 
    
    const cartFinded = await CartModel.findById(cid).lean();
    if (!cartFinded) return res.status(404).json({ message: 'Carrito no encontrado' });
  
    
    if (!Array.isArray(products) || !products.every(p => p.product && p.quantity >= 0)) {
      return res.status(400).json({ message: 'El formato de los productos es incorrecto' });
    }
  
    
    for (const item of products) {
      const product = await ProductsModel.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Producto con ID ${item.product} no encontrado` });
      }
    }
  
    
    const newCart = {
      ...cartFinded,
      products
    };
    

    const cartUpdated = await CartModel.findByIdAndUpdate(cid, newCart, {
      new: true,
    }).populate('products.product');
  
 
    res.status(200).json({ message: 'Carrito actualizado', cart: cartUpdated });
  });

  
router.put('/:cid/product/:pid', async (req, res)=> {
    const { cid } = req.params;
    const { pid } = req.body;
    const {newQuantity} = req.body;

    const cartUpdated = await CartModel.updateProductQuantity(cid, pid, newQuantity);
    res.status(201).json({message: 'Carrito actualizado', cart:cartUpdated})
});



router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;


    let cartFinded = await CartModel.findById(cid);

 
    if (!cartFinded) {
        cartFinded = new CartModel({
            _id: cid,
            products: []
        });
    }

    const indexProd = cartFinded.products.findIndex(prod => prod.product.toString() === pid);
    
    
    if (indexProd === -1) {
        cartFinded.products.push({ product: pid, quantity: 1 });
    } else {
      
        cartFinded.products[indexProd] = { 
            product: cartFinded.products[indexProd].product, 
            quantity: cartFinded.products[indexProd].quantity + 1 
        };
    }


    const cartUpdated = await CartModel.findByIdAndUpdate(cid, cartFinded, {
        new: true,
    }).populate('products.product');

    res.status(201).json({ message: 'Producto añadido al carrito', cart: cartUpdated });
});





router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    const cartFinded = await CartModel.findById(cid).lean();
    if(!cartFinded) res.status(404).json({ message: 'error' });

    const newCart = {
        ...cartFinded,
        products: []
    }
    const cartUpdated = await CartModel.findByIdAndUpdate(cid,newCart, {
        new: true,
    })

    res.status(201).json({ message: 'Carrito Vacio', cart: cartUpdated})
});





router.delete('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cartUpdated = await cartsManager.deleteProductFromCart(cid, pid);
    if (cartUpdated) {
      res.status(200).json({ message: 'Producto eliminado del carrito', cart: cartUpdated });
    } else {
      res.status(404).json({ message: 'Carrito o producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto del carrito', error: error.message });
  }
});



export default router;