import jwt, { Secret } from 'jsonwebtoken'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

export default class JWT {
  static async createToken(tokenData: any) {
    try {
      return await jwt.sign(
        {
          id: tokenData,
        },
        process.env.API_SECRET as Secret,
        {
          expiresIn: process.env.TOKEN_VALIDITY,
        }
      )
    } catch (err) {
      return null
    }
  }
}
