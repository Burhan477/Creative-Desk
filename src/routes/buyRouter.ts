import express from 'express'
import { details } from '../controllers/BuyController'

const router = express.Router()

router.get('/', details)

export default router
