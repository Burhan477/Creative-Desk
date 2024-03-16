import mongoose, { Schema, Document } from 'mongoose'

export interface IItem extends Document {
  user_id: mongoose.Types.ObjectId[]
  prompt_id: mongoose.Types.ObjectId
}

const ItemSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  prompt_id: { type: Schema.Types.ObjectId, ref: 'prompts', required: true },
})

export const Like = mongoose.model<IItem>('likes', ItemSchema)
