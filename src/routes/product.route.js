import { Router } from "express";
import { ProductModel } from "../models/product.model.js";
import { ProductManager } from "../class/ProductManager.js";
import { uploader } from "../utils.js";



const route = Router();
const model = new ProductManager(ProductModel)



route.get('/', async (req, res) => {
    /* const result = await model.findByQuery() */

    const result = await model.findById()
    
    if(!result) return res.json({ mensaje: 'Error en la consulta', payload: result })

        
    res.json({ mensaje: 'Productos', payload: result })

    /* if(!result) return res.json({ mensaje: 'Error en la consulta', payload: result })

        
        res.json({ payload: result }) */
})



/* route.get('/', async (req, res) => {
    const result = await UserModel.find({})

    res.json({ mensaje : 'Usuarios', result}) 

}) */

route.post('/', uploader.single('image') ,async (req, res) => {
    const file = req.file
    const body = req.body



res.json({mensaje: 'Producto agregado'})
})


export default route