/* eslint-disable no-prototype-builtins */
import { Request, Response } from 'express'
import errorHandler from '../helpers/lang/error'
import successHandler from '../helpers/lang/success'
import message from '../helpers/message'
import {
  getTopCategory,
  promptCategory,
  getTopCategoryById,
} from '../service/CategoryService'
import AWS from 'aws-sdk'

export const getCategories = async (req: Request, res: Response) => {
  // Retrieve all categories from the database
  try {
    // Retrieve a category by ID from the database
    const categoryData: any = await getTopCategory(req, res)
    if (categoryData) {
      return successHandler(
        res,
        200,
        message.success.categoryRetriveSuccessfully,
        categoryData
      )
    }
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  } catch (err) {
    console.log(err, 'error')
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
  // Send response
}

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    // Retrieve a category by ID from the database
    const categoryData: any = await getTopCategoryById(req, res)
    if (categoryData) {
      return successHandler(
        res,
        200,
        message.success.categoryRetriveSuccessfully,
        categoryData
      )
    }
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  } catch (err) {
    console.log(err, 'error')
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
  // Send response
}
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
  obj?.forEach((prompt: any) => {
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
  return obj
}
export const promptFromCategory = async (req: Request, res: Response) => {
  try {
    // Retrieve a category by ID from the database
    const categoryData: any = await promptCategory(req, res)

    if (req.params.timePeriod === 'feature') {
      const categoryData: any = await promptCategory(req, res)
      const newData: any = await replaceLandingImageUrl(categoryData[0].prompts)
      categoryData[0].prompts = newData
      if (categoryData[0]) {
        return successHandler(
          res,
          200,
          message.success.productRetriveSuccessfully,
          categoryData[0]
        )
      }
      return errorHandler(res, 400, message.error.somethingWentWrongError)
    } else {
      if (categoryData.length === 0) {
        return successHandler(
          res,
          200,
          message.success.subCategoryRetriveSuccessfully,
          categoryData
        )
      }
      const newData: any = await replaceLandingImageUrl(categoryData)
      if (newData) {
        return successHandler(
          res,
          200,
          message.success.categoryRetriveSuccessfully,
          newData
        )
      }
      return errorHandler(res, 400, message.error.somethingWentWrongError)
    }
  } catch (err) {
    console.log(err, 'error')
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
  // Send response
}

export const updateCategory = (req: Request, res: Response) => {
  // Update a category by ID with the request data
  // Send response
}

export const deleteCategory = (req: Request, res: Response) => {
  // Delete a category by ID from the database
  // Send response
}
