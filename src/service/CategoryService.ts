import { Request, Response } from 'express'
import { Category } from '../models/Category'
import mongoose from 'mongoose'
import { Prompt } from '../models/Prompt'

export const getTopCategoryById = async (req: Request, res: Response) => {
  const findTopCategory: any = await Category.findById(req.params.id)
    .select('name icon title page_title link description sub_category_id')
    .populate({
      path: 'sub_category_id',
      select: 'name title page_title link description product_id',
      populate: {
        path: 'product_id',
        model: 'products',
      },
    })
    .populate({
      path: 'sub_category_id.product_id',
      select: 'name title page_title link description prompt_id',
      populate: {
        path: 'prompt_id',
        model: 'prompts',
      },
    })
    .exec()
  if (findTopCategory) {
    // Generate the response object
    const response: any = findTopCategory

    return response
  }
  if (findTopCategory) {
    return findTopCategory
  }
  return null
}

export const getTopCategory = async (req: Request, res: Response) => {
  try {
    const findTopCategory = await Category.aggregate([
      {
        $lookup: {
          from: 'subcategories',
          localField: '_id',
          foreignField: 'category_id',
          as: 'subcategory',
        },
      },
      {
        $unwind: {
          path: '$subcategory',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'subcategory._id',
          foreignField: 'sub_category_id',
          as: 'subcategory.products',
        },
      },
      {
        $unwind: {
          path: '$subcategory.products',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'prompts',
          localField: 'subcategory.products._id',
          foreignField: 'product_id',
          as: 'subcategory.products.prompt_id',
        },
      },
      {
        $group: {
          _id: {
            _id: '$_id',
            sub_category_id: '$subcategory._id',
          },
          name: { $first: '$name' },
          icon: { $first: '$icon' },
          title: { $first: '$title' },
          page_title: { $first: '$page_title' },
          link: { $first: '$link' },
          description: { $first: '$description' },

          subcategory_id: { $first: '$subcategory._id' },
          subcategory_name: { $first: '$subcategory.name' },

          subcategory_title: { $first: '$subcategory.title' },

          subcategory_page_title: { $first: '$subcategory.page_title' },

          subcategory_link: { $first: '$subcategory.link' },

          subcategory_description: { $first: '$subcategory.description' },

          product_id: { $push: '$subcategory.products' },
        },
      },
      {
        $group: {
          _id: '$_id._id',
          name: { $first: '$name' },
          icon: { $first: '$icon' },
          title: { $first: '$title' },
          page_title: { $first: '$page_title' },
          link: { $first: '$link' },
          description: { $first: '$description' },

          sub_category_id: {
            $push: {
              _id: '$subcategory_id',
              name: '$subcategory_name',
              title: '$subcategory_title',
              page_title: '$subcategory_page_title',
              link: '$subcategory_link',
              description: '$subcategory_description',
              product_id: '$product_id',
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          icon: 1,
          title: 1,
          page_title: 1,
          link: 1,
          description: 1,
          sub_category_id: '$sub_category_id',
        },
      },
    ])

    if (findTopCategory) {
      // Generate the response object
      const response: any = findTopCategory

      return response
    }
    return null
  } catch (error) {
    console.error(error)
    return null
  }
}

function getData(id: any, timePeriod: string) {
  let query
  const currentDate = new Date()

  if (timePeriod === 'week') {
    const sevenDaysAgo = new Date(currentDate)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    query = Prompt.find({ category_id: id, created_at: { $gte: sevenDaysAgo } })
  } else if (timePeriod === 'month') {
    const pastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    )
    query = Prompt.find({
      category_id: id,
      created_at: {
        $gte: pastMonth,
        $lt: currentDate,
      },
    })
  } else if (timePeriod === 'feature') {
    query = Category.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'prompts',
          localField: '_id',
          foreignField: 'category_id',
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
  } else {
    query = Prompt.find({ category_id: id })
  }

  return query
}
export const promptCategory = async (req: Request, res: Response) => {
  const findPromptCategory: any = await getData(
    req.params.id,
    req.params.timePeriod
  )
  if (findPromptCategory) {
    // Generate the response object
    const response: any = findPromptCategory

    return response
  }
  return null
}
