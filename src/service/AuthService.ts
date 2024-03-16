//Auth service for create login
import { Request, Response } from 'express'
import * as bcrypt from 'bcrypt'
import { User } from '../models/User'
import { OTP } from '../models/OTP'
export const SignIn = async (req: Request, res: Response) => {
  const email = req.body.email
  const findUser: any = await User.findOne({ email: email.toLowerCase() })
  if (req.body.role === 'admin') {
    if (findUser.role === req.body.role) {
      return findUser
    } else {
      return 'wrongUser'
    }
  } else {
    if (findUser) {
      return findUser
    }
  }

  return null
}

export const emailVerification = async (req: Request) => {
  const email = req.body.email
  const findUser: any = await User.findOne({ email: email.toLowerCase() })
  if (findUser) {
    return true
  }
  return false
}
export const SignUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body
    const hash = await bcrypt.hash(password, 10)
    const user = new User({
      name: name,
      email: email.toLowerCase(),
      password: hash,
      role: 'user',
    })
    const saveUser: any = await user.save()
    if (saveUser) {
      return saveUser
    }
    return null
  } catch (err) {
    console.log('Error:', err)
    return null
  }
}

export const forgotPass = async (
  mail: string,
  otp: number,
  expire_time: Date
) => {
  try {
    const otpInserted: any = await OTP.create({
      otp: otp,
      email: mail,
      expire_time: expire_time,
    })
    if (otpInserted) return otpInserted
    else return false
  } catch (err) {
    return null
  }
}

export const resendOTP = async (mail: string, otp: any, expire_time: any) => {
  try {
    const lastDocument: any = await OTP.find({ email: mail })
      .sort({ date: -1 })
      .limit(1)
      .exec()

    if (lastDocument) {
      const otpInserted: any = await OTP.updateOne(
        {
          email: mail,
          _id: lastDocument[0]._id,
        },
        {
          $set: {
            otp: otp,
            expire_time: expire_time,
            is_verified: false,
          },
        },
        { sort: { date: -1 } }
      )

      if (otpInserted.matchedCount === 1) return true
      else return false
    } else return false
  } catch (err) {
    return null
  }
}
export const verify = async (verifyOtp: number, email: string) => {
  // send response from here
  const Otp: any = await OTP.find({
    otp: verifyOtp,
    email: email,
  })

  if (
    Otp &&
    Otp.length > 0 &&
    verifyOtp === Otp[0].otp &&
    Otp[0].expire_time > Date.now() &&
    Otp[0].is_verified === false
  ) {
    const Verified: any = await OTP.updateOne(
      { otp: verifyOtp },
      {
        is_verified: true,
      }
    )
    return Verified
  }
  return null
}

export const newPass = async (mail: string, pass: string) => {
  try {
    const setPassword = await User.updateOne(
      { email: mail },
      {
        $set: {
          password: pass,
        },
      }
    )
    if (setPassword) return setPassword
    else false
  } catch (err) {
    return null
  }
}
