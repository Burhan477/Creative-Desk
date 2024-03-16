import { Response } from 'express'
import { objResponseType, datatype } from '../types/types.success'

const successHandler = (
  res: Response,
  code: number,
  message: string,
  data?: datatype
) => {
  const objResponse: objResponseType = {
    success: true,
    message,
    data,
  }

  return res.status(code).send(objResponse)
}

export default successHandler
