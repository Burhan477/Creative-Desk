import mongoose, { Schema, Document } from 'mongoose'

export interface IItem extends Document {
  created_at: Date
  user_id: string
  prompt_id: mongoose.Types.ObjectId
}

const ItemSchema: Schema = new Schema({
  created_at: { type: Date, required: true, default: Date.now },
  user_id: { type: String, ref: 'users', required: true },
  prompt_id: {
    type: Schema.Types.ObjectId,
    ref: 'prompts',
    required: true,
  },
})

export const View = mongoose.model<IItem>('views', ItemSchema)
