import { Request, Response } from 'express'
import { detail, ProfileUpdateWithImage } from '../service/ProfileService'
import errorHandler from '../helpers/lang/error'
import successHandler from '../helpers/lang/success'
import message from '../helpers/message'
import uploadFile from '../documentUpload/upload.service'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

// import uploadFile from '../../helpers/documentUpload/upload.service';
import AWS from 'aws-sdk'

/**Get patientdetails controller
 * @author:  aniket.trapasiya<aniket.trapasiya@dataprophets.in>
 * @description:GET Patient Profile details using Email.
 * @return: all the patients details you need.
 *
 */
export const details = async (req: Request, res: Response) => {
  try {
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

    // const url = s3.getSignedUrl('getObject', params);

    const result: any = await detail(req)
    if (result.profile_url || result.poster) {
      const params = {
        Bucket: bucketName,
        Key: result.profile_url,
        Expires: 3600,
        // ACL: 'public-read',
        // ResponseContentDisposition: `attachment;filename="${result.Key}"`, // URL expiration time in seconds
      }
      const poster_params = {
        Bucket: bucketName,
        Key: result.poster,
        Expires: 3600,
        // ACL: 'public-read',
        // ResponseContentDisposition: `attachment;filename="${result.Key}"`, // URL expiration time in seconds
      }
      const fileUrl = await s3.getSignedUrl('getObject', params)
      const posterUrl = await s3.getSignedUrl('getObject', poster_params)
      result.profile_url = fileUrl
      result.poster = posterUrl
      if (!result) {
        return errorHandler(res, 400, message.error.somethingWentWrongError)
      }
      return successHandler(
        res,
        200,
        message.success.getProfileDataRetriveSuccessFully,
        result
      )
    }
    if (!result) {
      return errorHandler(res, 400, message.error.somethingWentWrongError)
    }
    return successHandler(
      res,
      200,
      message.success.getProfileDataRetriveSuccessFully,
      result
    )
  } catch (err) {
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
}

/**Update profile profile controller
 * @author:  aniket.trapasiya<aniket.trapasiya@dataprophets.in>
 * @description:Update Profile details using Email,Update the details with PUT method.
 * @return: updated row with data.
 */
export const ProfileUpdates = async (req: any, res: Response) => {
  try {
    const data = {
      name: req.body.name || '',
      profile: req.files['file'][0] || '',
      poster: req.files['poster'][0] || '',
    }
    if (req.files['file'][0] || req.files['poster'][0]) {
      if (!data.profile.mimetype.startsWith('image/') && data.profile) {
        return errorHandler(res, 400, message.error.fileIsMissingError)
      }
      if (data.poster && !data.poster.mimetype.startsWith('image/')) {
        return errorHandler(res, 400, message.error.fileIsMissingError)
      }
      const accessKeyId = process.env.S3_ACCESS_KEY_ID
      const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
      const bucketName = process.env.AWS_S3_BUCKET
      const region = process.env.S3_REGION
      const folderName = `${process.env.AWS_S3_FOLDER}/Profiles`
      const results: { key: string } = await uploadFile(
        req.files['file'][0],
        accessKeyId,
        secretAccessKey,
        bucketName,
        folderName,
        region
      )
      const poster_add: { key: string } = await uploadFile(
        req.files['poster'][0],
        accessKeyId,
        secretAccessKey,
        bucketName,
        folderName,
        region
      )
      const result = await ProfileUpdateWithImage(
        req,
        results.key,
        poster_add.key
      )
      if (result === true) {
        return successHandler(res, 200, message.success.profileEditSuccessFully)
      }
      return errorHandler(res, 400, message.error.somethingWentWrongError)
    }
    // const result = await ProfileUpdate(req, data)
    // if (result === true) {
    //   return successHandler(res, 200, message.success.profileEditSuccessFully)
    // } else if (result === 'notUpdated') {
    //   return successHandler(res, 401, message.error.profileNotEdited)
    // } else return errorHandler(res, 400, message.error.somethingWentWrongError)
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  } catch (err) {
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
}
