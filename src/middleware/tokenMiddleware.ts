// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
import { Response, NextFunction } from 'express'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import errorHandler from '../helpers/lang/error'
import message from '../helpers/message'
import { User } from '../models/User'

export async function authenticate(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.headers.authorization) {
      const token: string = req.headers.authorization?.split(' ')[1]
      if (!token) {
        return errorHandler(res, 401, message.error.tokenIsRequired)
      }
      const apiSecret: Secret | undefined = process.env.API_SECRET
      if (!apiSecret) {
        // Handle the case when API_SECRET is not defined
        return errorHandler(res, 500, 'API secret is missing')
      }
      const tokenValidate: JwtPayload | undefined = jwt.verify(
        token,
        apiSecret
      ) as JwtPayload | undefined
      if (!tokenValidate) {
        return errorHandler(res, 401, message.error.invalidAuthorizationToken)
      }
      const { id } = tokenValidate
      const user = await User.find({ _id: id })
      if (user) {
        req.user = user[0]
        return next()
      } else {
        return errorHandler(res, 401, message.error.invalidAuthorizationToken)
      }
    }
    return errorHandler(res, 401, message.error.invalidAuthorizationToken)
  } catch (error) {
    return errorHandler(res, 401, message.error.invalidAuthorizationToken)
  }
}
