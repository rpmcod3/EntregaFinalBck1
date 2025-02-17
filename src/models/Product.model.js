import mongoose, { Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = 'products';

const ProductSchema = new Schema({
    "title": String,
    "description": String,
    "price": Number,
    "thumbnail": String,
    "code": Number,
    "stock": Number,
    "category": String,
});

ProductSchema.plugin(mongoosePaginate)

export const ProductsModel = mongoose.model(productCollection, ProductSchema)

