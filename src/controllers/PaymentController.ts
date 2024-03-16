import { Request, Response } from 'express'
import {
  detail,
  PaymentOrder,
  PaymentSuccess,
  PaymentFail,
} from '../service/PaymentService'
import errorHandler from '../helpers/lang/error'
import successHandler from '../helpers/lang/success'
import message from '../helpers/message'
import crypto from 'crypto'
import { Payment } from '../models/Payment'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

/**Get patientdetails controller
 * @author:  aniket.trapasiya<aniket.trapasiya@dataprophets.in>
 * @description:GET Patient Profile details using Email.
 * @return: all the patients details you need.
 *
 */
export const details = async (req: Request, res: Response): Promise<any> => {
  try {
    // const url = s3.getSignedUrl('getObject', params);

    const result: any = await detail(req)

    if (!result) {
      return errorHandler(res, 400, message.error.somethingWentWrongError)
    }
    return successHandler(
      res,
      200,
      message.success.paymentDetailsRetriveSuccessfully,
      result
    )
  } catch (err) {
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
}

/**Update profile profile controller
 * @author:  aniket.trapasiya<aniket.trapasiya@dataprophets.in>
 * @description:Update Profile details using Email,Update the details with PUT method.
 * @return: updated row with data.
 */
export const Order = async (req: any, res: any): Promise<any> => {
  try {
    const result: any = await PaymentOrder(req)

    if (result == null) {
      return errorHandler(res, 400, message.error.somethingWentWrongError)
    }
    return successHandler(res, 200, message.success.OrderSuccessfull, result)
  } catch (err) {
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
}

export const Success = async (req: any, res: any): Promise<any> => {
  try {
    const result: any = await PaymentSuccess(req)
    if (!result === true) {
      return errorHandler(res, 400, message.error.somethingWentWrongError)
    }
    return successHandler(res, 200, message.success.PaymentSuccessfully)
  } catch (err) {
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
}

export const Fail = async (req: any, res: any): Promise<any> => {
  try {
    const result: any = await PaymentFail(req)
    if (!result === true) {
      return errorHandler(res, 400, message.error.somethingWentWrongError)
    }
    return successHandler(res, 200, message.success.paymentFail)
  } catch (err) {
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
}
// app.post('/webhook', (req, res) => {
export const Pending = async (req: any, res: any): Promise<any> => {
  // ... webhook signature verification logic

  const signature = req.headers['x-razorpay-signature']
  const body = req.body
  const secret: any = process.env.RAZORPAY_SECRET

  // Verify the webhook signature
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(JSON.stringify(body))
  const generatedSignature = hmac.digest('hex')

  if (generatedSignature === signature) {
    // Handle the webhook event
    console.log('Webhook event received:', body.event)
    if (body.event === 'payment.authorized') {
      // Handle the authorized payment here
      const payment = body.payload.payment.entity

      // Update your backend and database to reflect the authorized payment
      // For example, you can update the status of an order in your database
      updateOrderStatus(payment.order_id, 'authorized')
    }
    // Add your own custom logic here to handle the webhook event
  } else {
    console.log('Webhook signature verification failed')
  }

  res.status(200).send()
}

function updateOrderStatus(orderId: any, status: string) {
  Payment.updateOne(
    { razorpayDetails: { orderId: orderId } },
    { $set: { status: status } },
    function (err: any, result: any) {
      if (err) {
        console.log('Error updating order status:', err)
      } else {
        console.log('Order status updated successfully')
      }
    }
  )
}
