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





router.get('/', async (req, res) => {
  try {
    
    const { page = 1, limit = 10, sort = 'asc', query = '' } = req.query;

    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    
    const searchConditions = query ? { 'products.product.title': new RegExp(query, 'i') } : {}; 

    
    const sortConditions = sort === 'desc' ? { 'products.price': -1 } : { 'products.price': 1 };

    
    const carts = await CartModel.find(searchConditions)
      .skip((pageNum - 1) * limitNum) 
      .limit(limitNum) 
      .sort(sortConditions) 
      .populate('products.product') 
      .lean();

    
    const totalCarts = await CartModel.countDocuments(searchConditions);

    
    const totalPages = Math.ceil(totalCarts / limitNum);

    
    res.status(200).json({
      status: 'success',
      payload: carts,
      totalPages,
      page: pageNum,
      hasPrevPage: pageNum > 1,
      hasNextPage: pageNum < totalPages,
      prevPage: pageNum > 1 ? pageNum - 1 : null,
      nextPage: pageNum < totalPages ? pageNum + 1 : null
    });

  } catch (error) {
    console.error("Error al obtener los carritos:", error);
    res.status(500).json({ status: 'error', message: 'Error al obtener los carritos' });
  }
});





router.get('/:cid', async (req, res) => {
  const { cid } = req.params;  
  
  try {
      
      const cartFinded = await CartModel.findById(cid)
          .populate('products.product')  
          .lean();  
      
     
      if (!cartFinded) {
          return res.status(404).json({ message: 'Carrito no encontrado' });
      }

      
      res.status(200).json({
          message: 'Carrito encontrado',
          productList: cartFinded.products,  
      });
  } catch (error) {
      
      console.error('Error al obtener el carrito:', error);
      res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
  }
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

  

router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { newQuantity } = req.body;

  
  if (typeof newQuantity !== 'number' || newQuantity < 0) {
      return res.status(400).json({ message: 'Cantidad inválida' });
  }

  
  const cart = await CartModel.findById(cid);
  if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
  }

  
  const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
  if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
  }

  
  cart.products[productIndex].quantity = newQuantity;

  
  const updatedCart = await cart.save();

  res.status(200).json({ message: 'Cantidad actualizada', cart: updatedCart });
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