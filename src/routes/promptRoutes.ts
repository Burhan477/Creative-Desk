import express from 'express'
import multer from 'multer'
import fs from 'fs'
import {
  createPrompt,
  updatePrompt,
  deletePrompt,
  promptById,
} from '../controllers/PromptController'
import validatePrompt from '../validation/addProdductValidation'

const router = express.Router()
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    if (!fs.existsSync(`${__dirname}/../../uploads`)) {
      fs.mkdirSync(`${__dirname}/../../uploads`)
    }
    cb(null, './uploads')
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, file.originalname)
  },
})
// const upload = multer({ storage });

const uploading = multer({
  storage,
  limits: { fieldSize: 30 * 1024 * 1024 },
}).array('files', 9)

router.get('/tokendetail/', promptById)
router.post('/', uploading, validatePrompt, createPrompt)
router.put('/:id', updatePrompt)
router.delete('/:id', deletePrompt)

export default router
