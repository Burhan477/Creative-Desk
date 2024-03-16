import express from 'express'
import { addLike } from '../controllers/LikeController'

const router = express.Router()

router.put('/:id', addLike)

export default router
