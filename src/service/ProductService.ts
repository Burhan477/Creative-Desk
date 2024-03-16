import { Request, Response } from 'express'
import { Product } from '../models/Product'
import { Prompt } from '../models/Prompt'
import mongoose from 'mongoose'

interface AddProductsType {
  name: string
  page_title: string
  link: string
  description: string
  sub_category_id: mongoose.Types.ObjectId
  category_id: mongoose.Types.ObjectId
  _id: mongoose.Types.ObjectId
  created_at: Date
}

export const getSubProduct = async (req: Request, res: Response) => {
  try {
    const findProduct = await Product.aggregate([
      {
        $lookup: {
          from: 'subcategories',
          localField: 'sub_category_id',
          foreignField: '_id',
          as: 'subcategory',
        },
      },
      {
        $unwind: '$subcategory',
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'subcategory.category_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $project: {
          _id: '$_id',
          name: '$name',
          title: '$title',
          page_title: '$page_title',
          link: '$link',
          description: '$description',
          date: {
            $dateToString: {
              format: '%Y-%m-%d %H:%M',
              date: '$created_at',
            },
          },
          category_id: '$category._id',
          category_name: '$category.name',
          sub_category_id: '$subcategory._id',
          sub_category_name: '$subcategory.name',
        },
      },
    ])

    if (findProduct) {
      return findProduct
    }

    return null
  } catch (err) {
    console.log(err)
    return null
  }
}
function getData(id: string, timePeriod: string) {
  let query
  const currentDate = new Date()

  if (timePeriod === 'week') {
    const sevenDaysAgo = new Date(currentDate)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    query = Prompt.find({ product_id: id, created_at: { $gte: sevenDaysAgo } })
  } else if (timePeriod === 'month') {
    const pastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    )
    query = Prompt.find({
      product_id: id,
      created_at: {
        $gte: pastMonth,
        $lt: currentDate,
      },
    })
  } else {
    query = Prompt.find({ product_id: id })
  }

  return query
}

export const getSubProductById = async (req: Request) => {
  try {
    const findSubProduct: any = await getData(
      req.params.id,
      req.params.timePeriod
    )
    if (findSubProduct) {
      return findSubProduct
    }
    return null
  } catch (err) {
    console.log(err)
    return null
  }
}
export const getFourPrompt = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id

    const findSubProduct: any = await Product.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(productId),
        },
      },
      {
        $lookup: {
          from: 'prompts',
          localField: '_id',
          foreignField: 'product_id',
          as: 'prompts',
        },
      },
      {
        $project: {
          _id: 1,
          page_title: '$page_title',
          description: '$description',
          prompts: {
            $slice: [
              {
                $map: {
                  input: '$prompts',
                  as: 'prompt',
                  in: '$$prompt',
                },
              },
              4,
            ],
          },
        },
      },
    ])
    if (findSubProduct) {
      return findSubProduct[0]
    }
    return null
  } catch (err) {
    console.log(err)
    return null
  }
}
export const addSubProducts = async (req: Request, res: Response) => {
  const addProducts: AddProductsType | undefined = await Product.create({
    name: req.body.name,
    page_title: req.body.page_title,
    link: req.body.link,
    description: req.body.description,
    sub_category_id: req.body.sub_category_id,
    category_id: req.body.category_id,
  })

  if (addProducts) {
    return true
  }
  return null
}
