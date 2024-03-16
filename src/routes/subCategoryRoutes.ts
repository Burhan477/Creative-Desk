import express from 'express'
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/SubCategoryController'

const router = express.Router()

router.post('/', createCategory)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

export default router
