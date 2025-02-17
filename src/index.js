import express from 'express'
import productsRoute from './routes/products.router.js'
import cartsRoute from './routes/carts.router.js'
import viewsRoute from './routes/views.router.js'
import homeRoute from './routes/home.router.js'
import realTimeProducts from './routes/realtimeproducts.router.js'
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'
import path from "path";
import {Server} from 'socket.io'
import ProductsManager from './managers/productManager.js'
import { mongoConnection } from './connection/mongo.js'
import { engine } from "express-handlebars";


const app = express()
mongoConnection()

app.engine('handlebars', engine({
    helpers: {
        eq: (a, b) => a === b
    }
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');


app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(express.static(path.join(__dirname, "public")));

app.use("/", viewsRoute);
app.use('/api/products', productsRoute)
app.use('/api/carts', cartsRoute)
app.use('/home', homeRoute)
app.use('/realtimeproducts', realTimeProducts) 





const httpServer = app.listen(8080,()=>{
    console.log("Servidor correctamente Iniciado 8080")
})

export const socketServer = new Server(httpServer)



socketServer.on('connection', async (socket)=>{
    
    const productsList = await productManager.getAllProducts()
    socket.emit('home', productsList) 
    socket.emit('realtime', productsList) 
    socket.on('nuevo-producto', async(producto)=>{  
        await productManager.addProduct(producto)     
        socketServer.emit('realtime', productsList) 
    })


    socket.on('update-product', async (producto)=>{
        await productManager.updateProduct(producto, producto.id) 
        socketServer.emit('realtime',productsList) 
    })

   
    socket.on('delete-product', async(id) => {
        await productManager.deleteProduct(id)
        socketServer.emit('realtime', productsList) 
    })
})



