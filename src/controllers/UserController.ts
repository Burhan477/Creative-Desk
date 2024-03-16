import { Request, Response } from 'express'
import successHandler from '../helpers/lang/success'
import message from '../helpers/message'
import { User } from '../models/User'

export const getUser = async (req: any, res: Response) => {
  // Logic to fetch user from the database
  const user: any = await User.findById(req.params.id)
  return successHandler(res, 200, message.success.userDetailSuccessfully, user)
  // Send response
}

export const createUser = (req: Request, res: Response) => {
  // Logic to create a new user and save it to the database
  // Send response
}
