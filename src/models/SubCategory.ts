import mongoose, { Schema, Document } from 'mongoose'

export interface ISubCategory extends Document {
  name: string
  title: string
  page_title: string
  link: string
  description: string
  category_id: mongoose.Types.ObjectId
  created_at: Date
}

const SubCategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  page_title: { type: String, required: true },
  link: { type: String, required: true },
  description: { type: String, required: true },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'categories',
    required: true,
  },
  created_at: {
    type: Schema.Types.Date,
    default: Date.now,
  },
})

export const SubCategory = mongoose.model<ISubCategory>(
  'subcategories',
  SubCategorySchema
)
