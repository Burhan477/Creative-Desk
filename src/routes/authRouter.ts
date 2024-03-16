import express from 'express'
import {
  forgot,
  newPassword,
  otpVerification,
  resend,
  signIn,
  signUp,
} from '../controllers/AuthController'

const router = express.Router()

router.post('/signIn', signIn)
router.post('/signUp', signUp)
router.post('/forgot', forgot)
router.put('/otp', otpVerification)
router.put('/resend', resend)
router.put('/reset', newPassword)

export default router
