import mongoose from "mongoose";
import ProductsManager from './productManager.js';
import { CartModel } from "../models/Cart.model.js";
import { ProductsModel } from "../models/Product.model.js";




const productManager = new ProductsManager();


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {dbName: 'DDBB_Ecommerce'});
    console.log('Conectado a MongoDB Atlas');
  } catch (err) {
    console.error('Error al conectar a MongoDB Atlas', err);
  }
};


class CartsManager {
 
  async getAllCarts() {
    try {
      const carts = await CartModel.find().populate('products.productId');
      return carts;
    } catch (error) {
      console.error('Error al obtener los carritos:', error);
      throw error;
    }
  }

  
  async addCart() {
    try {
      const newCart = new Cart({ products: [] });
      const savedCart = await newCart.save();
      return savedCart._id;
    } catch (error) {
      console.error('Error al agregar un carrito:', error);
      throw error;
    }
  }

 
  async getCart(id) {
    try {
      const cart = await CartModel.findById(id).populate('products.productId');
      if (cart) {
        console.log('Carrito encontrado:', cart);
        return cart;
      } else {
        console.log('Carrito no encontrado');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      throw error;
    }
  }

 
  async addProductToCart(cid, pid) {
    try {
     
      const product = await ProductsModel.findById(pid);
      if (!product) {
        console.log('Producto no encontrado');
        return;
      }

    
      const cart = await CartModel.findById(cid);
      if (!cart) {
        console.log('Carrito no encontrado');
        return;
      }

    
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === pid
      );

      if (productIndex !== -1) {
       
        cart.products[productIndex].quantity++;
      } else {
        
        cart.products.push({ productId: product._id, quantity: 1 });
      }

    
      await cart.save();
      console.log('Producto agregado al carrito');
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error);
      throw error;
    }
  }
}

export default CartsManager;

