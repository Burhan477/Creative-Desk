import express from 'express'
import { details, ProfileUpdates } from '../controllers/ProfileCotroller'
import multer from 'multer'
import fs from 'fs'

const router = express.Router()
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(`${__dirname}/../../uploads`)) {
      fs.mkdirSync(`${__dirname}/../../uploads`)
    }
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})
// const upload = multer({ storage });

const uploading = multer({
  storage,
})
router.get('/', details)
router.put(
  '/',
  uploading.fields([{ name: 'file' }, { name: 'poster' }]),
  ProfileUpdates
)

export default router
