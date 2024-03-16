import { Response } from 'express'
import { arrMessage, objResponseType } from '../types/types.error'

const errorHandler = (res: Response, code: number, message: string) => {
  const errMessage: arrMessage = {
    title: 'Error',
    message,
  }
  const objResponse: objResponseType = {
    success: false,
    error: errMessage,
  }
  return res.status(code).send(objResponse)
}

export default errorHandler
