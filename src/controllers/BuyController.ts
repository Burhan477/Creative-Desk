import { Request, Response } from 'express'
import { detail } from '../service/BuyerService'
import errorHandler from '../helpers/lang/error'
import successHandler from '../helpers/lang/success'
import message from '../helpers/message'
import AWS from 'aws-sdk'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

/**Get BuyerDetail controller
 * @author:  aniket.trapasiya<aniket.trapasiya@dataprophets.in>
 * @description:GET Buyer details.
 * @return: all the Buyer details.
 */

function replaceLandingImageUrl(obj: any) {
  const accessKeyId = process.env.S3_ACCESS_KEY_ID
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
  const bucketName = process.env.AWS_S3_BUCKET
  const region = process.env.S3_REGION
  AWS.config.update({
    region: region,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  })

  const s3 = new AWS.S3()
  obj.map(
    async (item: {
      profile_url: string
      poster: string
      promptsList: { landing_image_url: string }[]
    }) => {
      const params = {
        Bucket: bucketName,
        Key: item.profile_url,
        Expires: 3600,
      }
      const posterParams = {
        Bucket: bucketName,
        Key: item.poster,
        Expires: 3600,
      }
      const fileUrl = s3.getSignedUrl('getObject', params)
      const posterUrl = s3.getSignedUrl('getObject', posterParams)
      item.profile_url = await fileUrl
      item.poster = await posterUrl
      item.promptsList?.forEach((prompt: { landing_image_url: string }) => {
        const params = {
          Bucket: bucketName,
          Key: prompt.landing_image_url,
          Expires: 3600,
          // ACL: 'public-read',
          // ResponseContentDisposition: `attachment;filename="${result.Key}"`, // URL expiration time in seconds
        }

        const fileUrl = s3.getSignedUrl('getObject', params)
        // result.profileUrl = fileUrl;
        prompt.landing_image_url = fileUrl
      })
      return item
    }
  )
  return obj
}
export const details = async (req: Request, res: Response): Promise<any> => {
  try {
    // const url = s3.getSignedUrl('getObject', params);

    const allPrompt: any = await detail(req)

    const newData: any = await replaceLandingImageUrl(allPrompt)
    allPrompt.promptsList = await newData

    if (allPrompt) {
      return successHandler(
        res,
        200,
        message.success.promptRetriveSuccessfully,
        allPrompt
      )
    } else return errorHandler(res, 400, message.error.somethingWentWrongError)
  } catch (err) {
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
}
