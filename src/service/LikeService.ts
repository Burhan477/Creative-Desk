import mongoose from 'mongoose'
import { Like } from '../models/Like'

export const AddLike = async (req: any, id: string) => {
  try {
    let likes
    const query = {
      user_id: new mongoose.Types.ObjectId(req.user.id),
      prompt_id: new mongoose.Types.ObjectId(id),
    }
    const liked = await Like.findOne(query)
    if (liked) {
      likes = await Like.deleteOne(query)
      return likes
    } else {
      likes = await Like.insertMany(query)
      return likes
    }
  } catch (err) {
    console.log(err)
    return null
  }
}
