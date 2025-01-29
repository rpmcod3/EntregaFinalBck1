import { Router } from "express";
import { carritoModel } from "../models/carrito.model.js";


const route = Router()

route.get('/', async (req, res ) => {
    const result = await carritoModel.find()
    res.json({result})
})


route.post ('/', async(req, res ) => {
    const { monto, fecha } = req.body 
    const result = await carritoModel.create({
        fecha,
        monto,
})
    res.json({result})
})


/*route.put ('/:idCarrito/:idProducto',...*/

route.put ('/', async(req, res ) => {
    const { id } = req.params 
   const carrito =  await carritoModel.findById('6799888f6e2d1fd6787834de')
    carrito.productos.push({producto:'67998c4a342428797d8bbc3f' })
    carrito.productos.push({producto:'67998cdb342428797d8bbc56' })
    const result = await carritoModel.updateOne({_id:'6799888f6e2d1fd6787834de'}, carrito)
       
    res.json({result})
})




/* */

export default route