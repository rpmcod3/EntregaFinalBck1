export class CarritoManager {
    constructor(model){
        this.model = model
        this.carts = []
    }




    async getCarts(){
        const response = await this.model.readFile(this.model, 'utf-8')
        this.carts = [...JSON.parse(response).data]
        return [...this.carts]
    }

    async newCart(){
        const newCart = { id: uuidv4(), products: [] }
        this.carts = await this.getCarts();
        this.carts.push(newCart);
        await fs.writeFile(this.model, JSON.stringify({ data: this.carts }))
        return newCart
    }

    async getCartById(id){
        this.carts = await this.getCarts();
        const cartFinded = this.carts.find( cart => cart.id === id)

        return cartFinded || console.log('No encontrado') 
    }

    async addProductToCard(id, productId){
        this.carts = await this.getCarts();
        const cartsUpdated = this.carts.map((cart)=>{
            if(cart.id !== id) return cart
            
            const indexProd = cart.products.findIndex(prod => prod.id === productId);
            if(indexProd === -1){
                cart.products.push({ id: productId, quantity: 1 })
                return cart;
            }
            cart.products[indexProd] = { ...cart.products[indexProd], quantity: cart.products[indexProd].quantity + 1 }
            return cart;
            
        })

    }




}


