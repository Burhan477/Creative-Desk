/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()
import fs from 'fs'
import errorHandler from '../helpers/lang/error'
import message from '../helpers/message'
import S3 from 'aws-sdk/clients/s3'

function uploadFile(
  file: any,
  accessKeyId: any,
  secretAccessKey: any,
  bucketName: any,
  folderName: any,
  region: any
) {
  const fileStream: any = fs.createReadStream(
    __dirname + `/../../uploads/${file.filename}`
  )
  try {
    const s3: any = new S3({
      accessKeyId,
      secretAccessKey,
      region,
    })
    const uploadParams: any = {
      Bucket: bucketName,
      Body: fileStream,
      Key: folderName + '/' + file.filename,
    }

    return s3.upload(uploadParams).promise()
  } catch (err) {
    return errorHandler(file.path, 404, message.error.fileNotFoundError)
  }
}
export default uploadFile
