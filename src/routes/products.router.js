import { Router } from "express";
import ProductsManager from '../managers/productManager.js';
import { __dirname } from '../utils.js'
import { socketServer } from "../index.js";
import { ProductsModel } from "../models/Product.model.js";

const router = Router()
const productManager = new ProductsManager();


    router.get("/", async (req, res) => {
        const { limit = 10, page = 1, sort = '', ...query } = req.query;
        const sortManager = {
          'asc': 1,
          'desc': -1
        }
      
        const products = await ProductsModel.paginate(
          { ...query },
          { 
            limit,
            page,
            ...(sort && { sort: { price: sortManager[sort]} }),
            customLabels: { docs: 'payload' }
          })
      
        res.json({
          ...products,
          status: 'success'
        });
      });



    router.get("/:id", async (req, res) => {
        const { id } = req.params;
      
        const productFinded = await ProductsModel.findById(id);
      
        const status = productFinded ? 200 : 404;
      
        res.status(status).json({ payload: productFinded });
      });

      router.post("/",  async (req, res) => {
       
     
      
        const prod = req.body;
        const result = await ProductsModel.create({
          ...prod,
       
        });
        
        res.status(201).json({ payload: result });
      });

      router.put("/:id",  async (req, res) => {
        const { body, params } = req;
        const { id } = params;
        const product = body;
        const productUpdated = await ProductsModel.findByIdAndUpdate(id, {
          ...product,
         
        }, { new: true });
      
        res.status(201).json({ message: "Updated successfully", payload: productUpdated });
      });
      
      router.delete("/:id", async (req, res) => {
        const { id } = req.params;
        const isDelete = await ProductsModel.findByIdAndDelete(id);
      
        res.status(isDelete ? 200 : 400).json({ payload: isDelete });
      });

export default router