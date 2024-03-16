// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
import errorHandler from '../helpers/lang/error'
import message from '../helpers/message'
import S3 from 'aws-sdk/clients/s3'

function getFileStream(
  fileKey: any,
  accessKeyId: string,
  secretAccessKey: string,
  bucketName: string,
  folderName: string,
  region: string
) {
  try {
    const s3: any = new S3({
      accessKeyId,
      secretAccessKey,
      region,
    })

    const downloadParams: any = {
      Key: fileKey,
      bucketName,
      folderName,
    }

    return s3.getObject(downloadParams).createReadStream()
  } catch (err) {
    return errorHandler(fileKey, 400, message.error.fileNotFoundError)
  }
}
export default getFileStream
