/* eslint-disable no-prototype-builtins */
import { Request, Response } from 'express'
import errorHandler from '../helpers/lang/error'
import successHandler from '../helpers/lang/success'
import message from '../helpers/message'
import {
  addSubProducts,
  getFourPrompt,
  getSubProduct,
  getSubProductById,
} from '../service/ProductService'
import AWS from 'aws-sdk'

export const getProducts = async (req: Request, res: Response) => {
  try {
    // Retrieve a category by ID from the database
    const categoryData: any = await getSubProduct(req, res)
    if (categoryData) {
      return successHandler(
        res,
        200,
        message.success.productRetriveSuccessfully,
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
export const getProductById = async (req: Request, res: Response) => {
  try {
    // Retrieve a category by ID from the database
    if (req.params.timePeriod === 'feature') {
      const categoryData = await getFourPrompt(req, res)
      const newData: any = await replaceLandingImageUrl(categoryData.prompts)
      categoryData.prompts = newData
      if (categoryData) {
        return successHandler(
          res,
          200,
          message.success.productRetriveSuccessfully,
          categoryData
        )
      }
      return errorHandler(res, 400, message.error.somethingWentWrongError)
    } else {
      const categoryData = await getSubProductById(req)
      const newData = await replaceLandingImageUrl(categoryData)

      if (newData) {
        return successHandler(
          res,
          200,
          message.success.productRetriveSuccessfully,
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

export const createProduct = async (req: Request, res: Response) => {
  try {
    //   Create a new category based on the request data
    const bodyData = req.body
    if (
      !bodyData.name ||
      !bodyData.page_title ||
      !bodyData.link ||
      !bodyData.description
    ) {
      return errorHandler(res, 400, message.error.somethingIsMissing)
    }
    const categoryData: true | null = await addSubProducts(req, res)
    if (categoryData === true) {
      return successHandler(res, 200, message.success.productAdded)
    }
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  } catch (err) {
    console.log(err, 'error')
    return errorHandler(res, 400, message.error.somethingWentWrongError)
  }
  //   // Send response
  // Save it to the database
  // Send response
}

export const updateProduct = (req: Request, res: Response) => {
  // Update a category by ID with the request data
  // Send response
}

export const deleteProduct = (req: Request, res: Response) => {
  // Delete a category by ID from the database
  // Send response
}
