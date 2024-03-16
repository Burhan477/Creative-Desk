import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  role: string
  email: string
  password: string
  date: Date
  token: string
  profile_url: string
  poster: string
  isActive: boolean
  isDelete: boolean
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  token: {
    type: String,
  },
  profile_url: {
    type: String,
  },
  poster: {
    type: String,
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

export const User = mongoose.model<IUser>('User', UserSchema)
