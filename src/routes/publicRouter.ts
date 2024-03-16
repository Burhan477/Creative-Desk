import express from 'express'
import {
  getSubCategories,
  SubCategoryById,
  promptSubCategories,
} from '../controllers/SubCategoryController'
import {
  getPrompts,
  marketPlace,
  promptCategoryMarketPlace,
  promptById,
} from '../controllers/PromptController'
import { getProductById, getProducts } from '../controllers/ProductController'
import {
  getCategories,
  getCategoryById,
  promptFromCategory,
} from '../controllers/CategoryContoller'

const router = express.Router()

router.get('/subCategory/', getSubCategories)
router.get('/subCategory/prompt/:id/:timePeriod', promptSubCategories)
router.get('/subCategory/:id', SubCategoryById)
router.get('/prompt/', getPrompts)
router.get('/prompt/detail/', promptById)
router.get('/product/', getProducts)
router.get('/product/:id/:timePeriod', getProductById)
router.get('/category/:id', getCategoryById)
router.get('/category/', getCategories)
router.get('/category/prompt/:id/:timePeriod', promptFromCategory)
router.get('/marketplace', marketPlace)
router.get('/marketplaceCategoty', promptCategoryMarketPlace)

export default router
