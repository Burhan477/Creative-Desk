import mongoose, { Schema, Document } from 'mongoose'

export interface IOTP extends Document {
  email: string
  otp: number
  is_verified: boolean
  expire_time: Date
  date: Date
  isActive: boolean
  isDelete: boolean
}

const OTPSchema: Schema<IOTP> = new Schema<IOTP>({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  expire_time: {
    type: Date,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
})

export const OTP = mongoose.model<IOTP>('otps', OTPSchema)
