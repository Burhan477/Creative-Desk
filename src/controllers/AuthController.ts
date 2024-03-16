import { Request, Response } from 'express'
import * as bcrypt from 'bcrypt'
import errorHandler from '../helpers/lang/error'
import successHandler from '../helpers/lang/success'
import message from '../helpers/message'
import {
  SignIn,
  SignUp,
  emailVerification,
  forgotPass,
  newPass,
  resendOTP,
  verify,
} from '../service/AuthService'
import JWT from './JWT'
import sendMail from '../view/mail.helper'
import otpGenerator from 'otp-generator'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

const generateOTP: any = () => {
  const OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  })

  return OTP
}
function AddMinutesToDate(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000)
}

const forgotConfig = {
  forgetLink: String(process.env.FORGET_LINK),
  mailLink: String(process.env.MAIL_LINK),
  unsubscribeLink: String(process.env.UNSUBSCRIBE_LINK),
}
export const signIn = async (req: Request, res: Response) => {
  try {
    const { password } = req.body
    const user: any = await SignIn(req, res)

    if (user === 'wrongUser') {
      return errorHandler(res, 404, message.error.wrongUserRole)
    }
    if (!user) {
      return errorHandler(res, 404, message.error.emailNotFoundError)
    }

    // Debugging - check if user object has password property

    if (typeof password !== 'string' || typeof user.password !== 'string') {
      return errorHandler(res, 400, message.error.invalidCredentials)
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return errorHandler(res, 401, message.error.wrongPasswordError)
    }
    const { _id } = user

    const token = await JWT.createToken(_id) // Check if createToken is accessible
    if (!token) {
      return errorHandler(res, 400, message.error.tokenNotFound)
    }
    user.token = token

    const responseData: any = user
    return successHandler(
      res,
      200,
      message.success.userSignInSuccessfully,
      responseData
    )
  } catch (err) {
    console.error('Sign-in error:', err)
    return errorHandler(res, 500, message.error.somethingWentWrongError)
  }
}

export const signUp = async (req: Request, res: Response) => {
  try {
    // Logic to create a new user and save it to the database
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return errorHandler(res, 400, message.error.validDataError)
    }
    const existUser: any = await SignIn(req, res)
    if (existUser) {
      return errorHandler(res, 400, message.error.userExistError)
    }
    const signup: any = await SignUp(req, res)

    const { _id } = signup

    const token = await JWT.createToken(_id) // Check if createToken is accessible
    if (!token) {
      return errorHandler(res, 400, message.error.tokenNotFound)
    }
    signup.token = token

    const responseData: any = signup

    if (signup) {
      return successHandler(
        res,
        200,
        message.success.signUpSuccessfull,
        responseData
      )
    } else return errorHandler(res, 400, message.error.somethingWentWrongError)
  } catch (err) {
    console.log(err, 'err')
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
  // Send response
}
export const forgot = async (req: Request, res: Response) => {
  const { email } = req.body
  const otpGenerated = generateOTP()
  const now = new Date()
  const expire_time = AddMinutesToDate(now, 15)
  if (!email) return errorHandler(res, 400, message.error.emailRequiredError)
  const emailValid = await emailVerification(req)

  if (!emailValid) {
    return errorHandler(res, 400, message.error.notRegisteredError)
  }
  const result = await forgotPass(email, otpGenerated, expire_time)

  try {
    if (result) {
      await sendMail(
        {
          email,
          otp: otpGenerated,
        },
        'forget.ejs',
        message.subject.welcomeToAHS
      )

      return successHandler(res, 200, message.success.sendMail)
    } else return errorHandler(res, 401, message.error.emailNotFoundError)
    // otherwise we need to create a temporary token that expires in 10 mins
  } catch (err) {
    return errorHandler(res, 404, message.error.somethingWentWrongError)
  }
}
export const otpVerification = async (req: Request, res: Response) => {
  const verifyOtp = parseInt(req.body.otp)
  const { email } = req.body
  if (!email) return errorHandler(res, 400, message.error.emailRequiredError)

  if (!verifyOtp) {
    return errorHandler(res, 400, message.error.otpNotFound)
  }

  try {
    if (verifyOtp) {
      const result: any = await verify(verifyOtp, email)

      if (result) {
        return successHandler(res, 200, message.success.otpVerifySuccessFully)
      }

      return errorHandler(res, 400, message.error.wrongOtpError)
    }
  } catch (err) {
    return errorHandler(res, 404, message.error.somethingWentWrongError)
  }
}
export const resend = async (req: Request, res: Response) => {
  const { email } = req.body
  const otpGenerated = generateOTP()
  const now = new Date()
  const expire_time = AddMinutesToDate(now, 15)

  if (!email) return errorHandler(res, 400, message.error.emailRequiredError)
  const result = await resendOTP(email, otpGenerated, expire_time)

  try {
    if (result) {
      await sendMail(
        {
          email,
          otp: otpGenerated,
        },
        'verify.ejs',
        message.subject.welcomeToAHS
      )

      return successHandler(res, 200, message.success.resendMail)
    }
    return errorHandler(res, 401, message.error.emailNotFoundError)
    // otherwise we need to create a temporary token that expires in 10 mins
  } catch (err) {
    return errorHandler(res, 404, message.error.somethingWentWrongError)
  }
}
export const newPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    const { password } = req.body
    const encryptPassword = await bcrypt.hash(password, 10)
    if (!email) return errorHandler(res, 400, message.error.emailRequiredError)
    const emailValid = await emailVerification(req)
    if (!emailValid) {
      return errorHandler(res, 400, message.error.notRegisteredError)
    }
    if (password) {
      const result: any = await newPass(email, encryptPassword)

      if (result.matchedCount === 1) {
        return successHandler(
          res,
          200,
          message.success.getPasswordResetSuccessfully
        )
      }
      return errorHandler(res, 400, message.error.notRegisteredError)
    }
    return errorHandler(res, 401, message.error.somethingWentWrongError)
  } catch (err) {
    return errorHandler(res, 404, message.error.somethingWentWrongError)
  }
}
