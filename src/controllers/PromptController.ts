import { Request, Response } from 'express'
import uploadFile from '../documentUpload/upload.service'
import errorHandler from '../helpers/lang/error'
import successHandler from '../helpers/lang/success'
import message from '../helpers/message'
import fs from 'fs'
import AWS from 'aws-sdk'
import {
  addChatGPTPrompt,
  addDALL_EPrompt,
  addMidjourneyPrompt,
  addPromptbasePrompt,
  addStableDiffusionPrompt,
  getPrompt,
  getPromptById,
  AddView,
  LikeCount,
  LikedOrNot,
  getMarketPlace,
  getPromptCategory,
  selledCount,
} from '../service/PromptService'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

export const marketPlace = async (req: Request, res: Response) => {
  try {
    const allPrompt = await getMarketPlace(req, res)
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
    if (allPrompt === null) {
      return errorHandler(res, 400, message.error.somethingWentWrongError)
    } else if (allPrompt?.length === 0) {
      return successHandler(
        res,
        200,
        message.success.promptRetriveSuccessfully,
        allPrompt
      )
    } else {
      const y = allPrompt.map((promptData: { landing_image_url: string }) => {
        const params = {
          Bucket: bucketName,
          Key: promptData.landing_image_url,
          Expires: 3600,
          // ACL: 'public-read',
          // ResponseContentDisposition: `attachment;filename="${result.Key}"`, // URL expiration time in seconds
        }

        const landingImage = s3.getSignedUrl('getObject', params)
        promptData.landing_image_url = landingImage

        return promptData
      })

      if (y) {
        return successHandler(
          res,
          200,
          message.success.promptRetriveSuccessfully,
          y
        )
      }

      return errorHandler(res, 400, message.error.somethingWentWrongError)
    }
  } catch (err) {
    console.log(err)
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
}

export const promptCategoryMarketPlace = async (
  req: Request,
  res: Response
) => {
  try {
    const allPrompt = await getPromptCategory(req, res)

    if (allPrompt) {
      return successHandler(
        res,
        200,
        message.success.promptRetriveSuccessfully,
        allPrompt
      )
    }

    return errorHandler(res, 400, message.error.somethingWentWrongError)
  } catch (err) {
    console.log(err)
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
}

export const getPrompts = async (req: Request, res: Response) => {
  try {
    const allPrompt = await getPrompt(req, res)
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
    if (req.query.timePeriod === 'feature') {
      const newData = allPrompt.prompts.map(
        (promptData: {
          landing_image_url: string
          sample_images_url: string[]
        }) => {
          const params = {
            Bucket: bucketName,
            Key: promptData.landing_image_url,
            Expires: 3600,
            // ACL: 'public-read',
            // ResponseContentDisposition: `attachment;filename="${result.Key}"`, // URL expiration time in seconds
          }

          const landingImage = s3.getSignedUrl('getObject', params)
          const profile_images = promptData.sample_images_url.map(
            (item: string) => {
              const params = {
                Bucket: bucketName,
                Key: item,
                Expires: 3600,
                // ACL: 'public-read',
                // ResponseContentDisposition: `attachment;filename="${result.Key}"`, // URL expiration time in seconds
              }

              const fileUrl = s3.getSignedUrl('getObject', params)
              return fileUrl
            }
          )
          promptData.landing_image_url = landingImage
          promptData.sample_images_url = profile_images

          return promptData
        }
      )
      allPrompt.prompts = newData
      if (allPrompt) {
        return successHandler(
          res,
          200,
          message.success.promptRetriveSuccessfully,
          allPrompt
        )
      } else
        return errorHandler(res, 400, message.error.somethingWentWrongError)
    } else {
      const y = allPrompt.map(
        (promptData: {
          landing_image_url: string
          sample_images_url: string[]
        }) => {
          const params = {
            Bucket: bucketName,
            Key: promptData.landing_image_url,
            Expires: 3600,
            // ACL: 'public-read',
            // ResponseContentDisposition: `attachment;filename="${result.Key}"`, // URL expiration time in seconds
          }

          const landingImage = s3.getSignedUrl('getObject', params)
          const profile_images = promptData.sample_images_url.map(
            (item: string) => {
              const params = {
                Bucket: bucketName,
                Key: item,
                Expires: 3600,
                // ACL: 'public-read',
                // ResponseContentDisposition: `attachment;filename="${result.Key}"`, // URL expiration time in seconds
              }

              const fileUrl = s3.getSignedUrl('getObject', params)
              return fileUrl
            }
          )
          promptData.landing_image_url = landingImage
          promptData.sample_images_url = profile_images

          return promptData
        }
      )

      if (y) {
        return successHandler(
          res,
          200,
          message.success.promptRetriveSuccessfully,
          y
        )
      }
      return errorHandler(res, 400, message.error.somethingWentWrongError)
    }
  } catch (err) {
    console.log(err)
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
}

export const promptById = async (req: Request, res: Response) => {
  try {
    let resultData: any
    const promptDetails: any = await getPromptById(req, res)
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

    const params = {
      Bucket: bucketName,
      Key: promptDetails.landing_image_url,
      Expires: 3600,
    }

    const landingImage = s3.getSignedUrl('getObject', params)
    const profile_images = promptDetails.sample_images_url.map(
      (item: string) => {
        let fileUrl
        if (item !== null) {
          const params = {
            Bucket: bucketName,
            Key: item,
            Expires: 3600,
          }
          fileUrl = s3.getSignedUrl('getObject', params)
        }
        return fileUrl
      }
    )
    promptDetails.landing_image_url = landingImage

    promptDetails.sample_images_url = profile_images

    if (promptDetails) {
      resultData = promptDetails.toObject()
      const views: any = await AddView(req, promptDetails._id)
      const likeCount = await LikeCount(req, promptDetails._id)
      const liked = await LikedOrNot(req, promptDetails._id)
      const sell = await selledCount(req, promptDetails._id)

      resultData.likeCount = likeCount
      resultData.liked = liked
      resultData.sell = sell
      if (views >= 0) {
        resultData.views = views
        return successHandler(
          res,
          200,
          message.success.promptRetriveSuccessfully,
          resultData
        )
      } else {
        return errorHandler(res, 400, message.error.somethingWentWrongError)
      }
    }

    // Send response
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  } catch (err) {
    console.log(err)
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
}

export const createPrompt = async (req: any, res: Response) => {
  try {
    const result: string[] = []

    if (req.files && req.body.prompt_type !== 'gpt') {
      if (req.files.length < 3) {
        return errorHandler(res, 400, message.error.imageLimitthreeError)
      }
      if (req.files.length > 10) {
        return errorHandler(res, 400, message.error.imageLimitError)
      }
      const files = req.files
      const accessKeyId = process.env.S3_ACCESS_KEY_ID
      const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
      const bucketName = process.env.AWS_S3_BUCKET
      const region = process.env.S3_REGION

      const results = await Promise.all(
        files.map(async (file: { mimetype: string }) => {
          // let folder = '';
          // logger.info(file);
          // logger.info(folder);
          const folderName = `${process.env.AWS_S3_FOLDER}/${req.body.name}`

          const result = await uploadFile(
            file,
            accessKeyId,
            secretAccessKey,
            bucketName,
            folderName,
            region
          )
          return { key: result.key }
        })
      )
      files.forEach((file: { path: fs.PathLike }) => {
        fs.unlink(file.path, function (err) {
          if (err) throw err
        })
      })
      results.forEach((obj: { key: string }) => {
        result.push(obj.key)
      })
    }
    let prompt
    const { prompt_type } = req.body

    switch (prompt_type) {
      case 'gpt':
        prompt = await addChatGPTPrompt(req)
        break
      case 'dalle':
        req.body.sample_images_url = result
        prompt = await addDALL_EPrompt(req)
        break
      case 'midjourney':
        req.body.sample_images_url = result
        prompt = await addMidjourneyPrompt(req)
        break
      case 'stableDiffusion':
        req.body.sample_images_url = result
        prompt = await addStableDiffusionPrompt(req)
        break
      case 'promptbase':
        req.body.sample_images_url = result
        prompt = await addPromptbasePrompt(req)
        break
      default:
        return errorHandler(res, 400, 'Invalid prompt_type')
    }

    if (prompt === true) {
      return successHandler(res, 200, message.success.newPromptAdded)
    }
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  } catch (err) {
    console.log(err)
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
  // Create a new prompt based on the request data
  // Save it to the database
  // Send response
}

export const updatePrompt = (req: Request, res: Response) => {
  // Update a prompt by ID with the request data
  // Send response
}

export const deletePrompt = (req: Request, res: Response) => {
  // Delete a prompt by ID from the database
  // Send response
}
