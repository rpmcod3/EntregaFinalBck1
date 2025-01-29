import { model, Schema } from "mongoose"

const carritoColeccion = 'carrito'

const carritoSchema = new Schema({
    fecha: String,
    monto: Number,
    productos: {
        type: [{
            producto: {
                type: Schema.Types.ObjectId,
                ref: 'products'
            },
            cantidad: Number,
        }],
        default: []
    },
})

//hacia donde va la referencia cuando guardo un id 


export const carritoModel = model(carritoColeccion, carritoSchema)

