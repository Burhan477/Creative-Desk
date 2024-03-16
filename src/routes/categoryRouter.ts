import express from 'express'
import {
  updateCategory,
  deleteCategory,
} from '../controllers/CategoryContoller'

const router = express.Router()

router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

export default router
