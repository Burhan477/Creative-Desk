import mongoose, { Schema, Document } from 'mongoose'

export interface IItem extends Document {
  user_id: mongoose.Types.ObjectId
  prompt_id: mongoose.Types.ObjectId
  created_at: Date
}

const ItemSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  prompt_id: { type: Schema.Types.ObjectId, ref: 'Prompt', required: true },
  razorpayDetails: {
    orderId: String,
    paymentId: String,
    signature: String,
    amount: String,
    currency: String,
    status: String,
  },
  success: Boolean,
  created_at: {
    type: Schema.Types.Date,
    default: Date.now,
  },
})

export const Payment = mongoose.model<IItem>('Payment', ItemSchema)
