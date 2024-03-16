import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
  name: string
  icon: string
  title: string
  page_title: string
  link: string
  description: string
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  icon: { type: String, required: false },
  title: { type: String, required: true },
  page_title: { type: String, required: true },
  link: { type: String, required: true },
  description: { type: String, required: true },
})
export const Category = mongoose.model<ICategory>('categories', CategorySchema)
