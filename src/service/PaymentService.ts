import Razorpay from 'razorpay'
import { Payment } from '../models/Payment'
import { Buy } from '../models/Buy'
import crypto from 'crypto'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

/**Get userdetails services
 * @author:  aniket.trapasiya<aniket.trapasiya@dataprophets.in>
 * @description:GET user Profile details using Email.
 * @return: all the users details you need.
 */
export const detail = async (req: any) => {
  const findProduct = await Payment.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'users',
      },
    },
    {
      $unwind: '$users',
    },
    {
      $lookup: {
        from: 'prompts',
        localField: 'prompt_id',
        foreignField: '_id',
        as: 'prompts',
      },
    },
    {
      $unwind: '$prompts',
    },
    {
      $project: {
        _id: '$_id',
        status: '$razorpayDetails.status',
        amount: '$razorpayDetails.amount',
        orderId: '$razorpayDetails.orderId',
        paymentId: '$razorpayDetails.paymentId',
        date: {
          $dateToString: {
            format: '%Y-%m-%d %H:%M',
            date: '$created_at',
          },
        },
        prompt_id: '$prompts._id',
        prompt_name: '$prompts.name',
        user_id: '$users._id',
        name: '$users.name',
      },
    },
  ])
  // const paymentDetail: any = await Payment.find()
  if (findProduct) {
    return findProduct
  } else {
    return null
  }
}

/**Update userdetails controller
 * @author:  aniket.trapasiya<aniket.trapasiya@dataprophets.in>
 * @description:Update user Profile details with update query.
 * @return: updated row with data.
 */
export const PaymentOrder = async (req: any) => {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as unknown as any, // YOUR RAZORPAY KEY
    key_secret: process.env.RAZORPAY_SECRET, // YOUR RAZORPAY SECRET
  })

  const options = {
    amount: 50000,
    currency: 'INR',
    receipt: 'receipt_order_74394',
  }

  const order = await instance.orders.create(options)

  if (order) {
    return order
  } else {
    return null
  }
}
export const PaymentSuccess = async (req: any) => {
  const {
    orderCreationId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
    amount,
    currency,
  } = req.body
  const razor_pay_secret: any = process.env.RAZORPAY_SECRET
  const shasum = crypto.createHmac('sha256', razor_pay_secret)
  shasum.update(`${orderCreationId}|${razorpayPaymentId}`)
  const digest = shasum.digest('hex')
  if (digest !== razorpaySignature) return false
  else {
    const addProducts = await Payment.create({
      user_id: '64b0e091f9f299d84070c833',
      prompt_id: '64b1341aafb85786489d477b',
      razorpayDetails: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
        amount: amount / 100,
        currency: currency,
        status: 'success',
      },
      success: true,
    })

    const buyProduct = await Buy.create({
      user_id: '64b0e091f9f299d84070c833',
      prompt_id: '64b1341aafb85786489d477b',
      transaction_id: addProducts._id,
    })
    if (addProducts && buyProduct) {
      return true
    } else return null
  }
  // const newPayment = PaymentDetails();

  // await newPayment.save();
}

export const PaymentFail = async (req: any) => {
  const {
    orderCreationId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
    amount,
    currency,
  } = req.body
  const razor_pay_secret: any = process.env.RAZORPAY_SECRET
  const shasum = crypto.createHmac('sha256', razor_pay_secret)
  shasum.update(`${orderCreationId}|${razorpayPaymentId}`)
  const digest = shasum.digest('hex')
  if (digest !== razorpaySignature) return false
  else {
    const addProducts = await Payment.create({
      user_id: '64b0e091f9f299d84070c833',
      prompt_id: '64b1341aafb85786489d477b',
      razorpayDetails: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
        amount: amount,
        currency: currency,
        status: 'fail',
      },
      success: true,
    })
    if (addProducts) {
      return true
    } else return null
  }
}
