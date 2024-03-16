import { Response } from 'express'
import successHandler from '../helpers/lang/success'
import message from '../helpers/message'
import errorHandler from '../helpers/lang/error'
import { AddLike } from '../service/LikeService'
export const addLike = async (req: any, res: Response) => {
  try {
    // Retrieve a category by ID from the database

    if (req.params.id) {
      const like: any = await AddLike(req, req.params.id)
      if (like) {
        return successHandler(res, 200, message.success.liked)
      }
      return errorHandler(res, 400, message.error.somethingWentWrongError)
    } else return errorHandler(res, 400, message.error.parameterMissing)
  } catch (err) {
    console.log(err, 'error')
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
}
