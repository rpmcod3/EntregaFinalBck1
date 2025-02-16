import mongoose, { Schema } from "mongoose";

const cartCollection = 'carts';

const cartSchema = new Schema({
    products: {
        type: [{
            quantity: {
                type: Number,
                default: 0
            },
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            }
        }],
        default: []
    },
});



/* cartSchema.pre(['find', 'findOne', 'findById'], function (next) {
    this.populate('products.product', '_id title price');
    next();
});
 */

export const cartModel = mongoose.model(cartCollection, cartSchema)