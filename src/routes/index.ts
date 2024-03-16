import express from 'express'
import userRoutes from './userRoutes'
import profileRouter from './profileRouter'
import promptRouter from './promptRoutes'
import subCategoryRoutes from './subCategoryRoutes'
import authRoutes from './authRouter'
import categoryRouter from './categoryRouter'
import productRouter from './productRouter'
import paymentRouter from './paymentRouter'
import likeRouter from './likeRouter'
import publicRouter from './publicRouter'
import buyRouter from './buyRouter'
import { authenticate } from '../middleware/tokenMiddleware'

const router = express()
router.use('/auth', authRoutes)
router.use('/v1', publicRouter)
router.use(authenticate)
router.use('/user', userRoutes)
router.use('/profile', profileRouter)
router.use('/payment', paymentRouter)
router.use('/prompt', promptRouter)
router.use('/subCategory', subCategoryRoutes)
router.use('/category', categoryRouter)
router.use('/product', productRouter)
router.use('/like', likeRouter)
router.use('/buyer', buyRouter)

export default router
