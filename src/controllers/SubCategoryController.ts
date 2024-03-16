/* eslint-disable no-prototype-builtins */
import { Request, Response } from 'express'
import errorHandler from '../helpers/lang/error'
import successHandler from '../helpers/lang/success'
import message from '../helpers/message'
import {
  addCategories,
  getCategory,
  getSubCategoryById,
  promptSubCategory,
} from '../service/SubCategoryService'
import AWS from 'aws-sdk'

export const getSubCategories = async (req: Request, res: Response) => {
  try {
    // Retrieve a category by ID from the database
    const categoryData: any = await getCategory(req, res)
    if (categoryData) {
      return successHandler(
        res,
        200,
        message.success.subCategoryRetriveSuccessfully,
        categoryData
      )
    }
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  } catch (err) {
    console.log(err, 'error')
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
  // Retrieve all categories from the database
  // Send response
}

export const SubCategoryById = async (req: Request, res: Response) => {
  try {
    // Retrieve a category by ID from the database
    const categoryData = await getSubCategoryById(req, res)
    if (categoryData) {
      return successHandler(
        res,
        200,
        message.success.subCategoryRetriveSuccessfully,
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
  obj?.forEach((prompt: { landing_image_url: string }) => {
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
export const promptSubCategories = async (req: Request, res: Response) => {
  try {
    // Retrieve a category by ID from the database

    const categoryData = await promptSubCategory(req, res)

    if (req.params.timePeriod === 'feature') {
      const newData = await replaceLandingImageUrl(categoryData[0].prompts)
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
    } else if (categoryData.length === 0) {
      return successHandler(
        res,
        200,
        message.success.subCategoryRetriveSuccessfully,
        categoryData
      )
    } else {
      const profile_images = await replaceLandingImageUrl(categoryData)
      if (profile_images) {
        return successHandler(
          res,
          200,
          message.success.subCategoryRetriveSuccessfully,
          profile_images
        )
      }
      return errorHandler(res, 400, message.error.somethingWentWrongError)
    }
  } catch (err) {
    console.log(err, 'error')
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
  // Retrieve all categories from the database
  // Send response
}
export const createCategory = async (req: Request, res: Response) => {
  try {
    // Create a new category based on the request data
    const bodyData = req.body
    if (
      !bodyData.name ||
      !bodyData.title ||
      !bodyData.page_title ||
      !bodyData.link ||
      !bodyData.description
    ) {
      return errorHandler(res, 400, message.error.somethingIsMissing)
    }
    const categoryData: true | null = await addCategories(req)
    if (categoryData === true) {
      return successHandler(res, 200, message.success.subCategoryAdded)
    }
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  } catch (err) {
    console.log(err, 'error')
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
  // Send response
  // Save it to the database
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
