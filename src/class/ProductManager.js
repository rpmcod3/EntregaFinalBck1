
export class ProductManager {
    constructor(model){
        this.model = model
        this.product = []
    }

    async add(product){
        try{
            const result = await this.model.create(product)
            return result
        } catch (e){
            return null
        }
    }

    async edit(product, id){
        try{
            const result = await this.model.findByIdAndUpdate(id, product, { new: true })
            return result
        } catch (e){
            return null
        }
    }

    async editByQuery(product, query){
        try{
            const result = await this.model.findAndUpdate(query, product, { new: true })
            return result
        } catch (e){
            return null
        }
    }

    async findById(id){
        try{
            const result = await this.model.findOne(id)
            return result
        } catch (e){
            return null
        }
    }

    async findByQuery(query = {}){
        try{
            const result = await this.model.find(query).explain("executionStats")
            return result
        } catch (e){
            return null
        }
    }

    async deleteById(id){
        try{
            const result = await this.model.deleteById(id)
            return result
        } catch (e){
            return null
        }
    }

    async deleteByQuery(query){
        try{
            const result = await this.model.delete(query)
            return result
        } catch (e){
            return null
        }
    }


}




/* Product manager de entrega anterior 


import { promises } from 'node:dns'
import fs from 'node:fs'

class ProductsManager {
    constructor(path){
        this.path = path

        this.product = {}
        this.productsList = []
    }

    async setNewId(){
        const now = await new Date();
        return now.getTime();
    }

    // Funciones para Products
    async getProduct(id){
        const list = await fs.promises.readFile(this.path, 'utf-8')
        this.productsList = [...JSON.parse(list).products]
        this.productsList.map((prod,i)=>{
            if (prod.id == id) {
                this.product = prod
            }
        })
        return {...this.product}
    }
    async getAllProducts(){
        const list = await fs.promises.readFile(this.path, 'utf-8')
        this.productsList = [...JSON.parse(list).products]
        return [...this.productsList]
    }
    async addProduct(product){
        const newId = await this.setNewId()  
        await this.getAllProducts();  
        let newProduct = { 
            "id": newId,
            "description": "",
            "title": "",
            "code": "",
            "price": 0,
            "status": true,
            "stock": 0,
            "category": ""
        }
         
        
        product.description ? newProduct.description = product.description : null 
        product.title ? newProduct.title = product.title : null
        product.code ? newProduct.code = product.code : null
        product.price ? newProduct.price = product.price : null
        product.status ? newProduct.status = product.status : null
        product.stock ? newProduct.stock = product.stock : null
        product.category ? newProduct.category = product.category : null
        this.productsList.push(newProduct) 
        await fs.promises.writeFile(this.path,JSON.stringify({ products: this.productsList }))  
    }

    
    async updateProduct(product,id){
        await this.getAllProducts();
        if (this.productsList.some(obj => obj.id == id)) {
            const prod = this.productsList.find(obj => obj.id == id)
            product.title ? prod.title = product.title : null
            product.description ? prod.description = product.description : null
            product.code ? prod.code = product.code :null
            product.price ? prod.price = product.price :null
            product.status ? prod.status = product.status :null
            product.stock ? prod.stock = product.stock :null
            product.category ? prod.category = product.category :null

            await fs.promises.writeFile(this.path,JSON.stringify({ products: this.productsList }))
            console.log("Producto Modificado")
        } else {
            console.log("ID no encontrado")
        }
    }


   
    async deleteProduct(id){
        await this.getAllProducts();
        if (this.productsList.some(obj => obj.id == id)) {
            const i = this.productsList.findIndex(obj => obj.id == id)
            this.productsList.splice(i,1)
            await fs.promises.writeFile(this.path,JSON.stringify({ products: this.productsList }))
            console.log("Producto Eliminado")
        } else {
            console.log("ID no encontrado")
        }
    }


}

export default ProductsManager

 */