import mongoose, { Schema, Document } from 'mongoose'

export interface IItem extends Document {
  message: string
  rating: number
  date: Date
  review_id: mongoose.Types.ObjectId
  prompt_id: mongoose.Types.ObjectId
}

const ItemSchema: Schema = new Schema({
  message: { type: String, required: true, maxlength: 100 }, //max length 100
  rating: { type: Number, required: true, min: 0, max: 5 }, // max 5 min 0
  date: { type: Date, required: true },
  reviewer_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  prompt_id: {
    type: Schema.Types.ObjectId,
    ref: 'prompts',
    required: true,
  },
})

export const Item = mongoose.model<IItem>('Review', ItemSchema)
