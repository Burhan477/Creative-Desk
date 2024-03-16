import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  page_title: string
  link: string
  description: string
  sub_category_id: mongoose.Types.ObjectId
  category_id: mongoose.Types.ObjectId
  created_at: Date
}

const ProdcutSchema: Schema = new Schema({
  name: { type: String, required: true },
  page_title: { type: String, required: true },
  link: { type: String, required: true },
  description: { type: String, required: true },
  sub_category_id: {
    type: Schema.Types.ObjectId,
    ref: 'subcategories',
    required: true,
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'categories',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

export const Product = mongoose.model<IProduct>('products', ProdcutSchema)
