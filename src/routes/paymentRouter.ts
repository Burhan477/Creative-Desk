import express from 'express'
import {
  details,
  Order,
  Success,
  Fail,
  Pending,
} from '../controllers/PaymentController'

const router = express.Router()

router.get('/', details)
router.get('/webhook', Pending)
router.post('/order', Order)
router.post('/success', Success)
router.post('/fail', Fail)

export default router
