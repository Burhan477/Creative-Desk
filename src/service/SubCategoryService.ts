import { Request, Response } from 'express'
import { SubCategory } from '../models/SubCategory'
import mongoose from 'mongoose'
import { Prompt } from '../models/Prompt'

interface AddSubCategoryType {
  name: string
  page_title: string
  link: string
  description: string
  category_id: mongoose.Types.ObjectId
  _id: mongoose.Types.ObjectId
  created_at: Date
}
export const getCategory = async (req: Request, res: Response) => {
  try {
    const findCategory: any = await SubCategory.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
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
        },
      },
    ])

    if (findCategory) {
      return findCategory
    }

    return null
  } catch (err) {
    console.log(err)
    return null
  }
}

function getData(id: any, timePeriod: string) {
  let query
  const currentDate = new Date()

  if (timePeriod === 'week') {
    const sevenDaysAgo = new Date(currentDate)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    query = Prompt.find({
      sub_category_id: id,
      created_at: { $gte: sevenDaysAgo },
    })
  } else if (timePeriod === 'month') {
    const pastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    )
    query = Prompt.find({
      sub_category_id: id,
      created_at: {
        $gte: pastMonth,
        $lt: currentDate,
      },
    })
  } else if (timePeriod === 'feature') {
    query = SubCategory.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'prompts',
          localField: '_id',
          foreignField: 'sub_category_id',
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
    query = Prompt.find({ sub_category_id: id })
  }

  return query
}

export const getSubCategoryById = async (req: Request, res: Response) => {
  try {
    const findCategory: any = await SubCategory.findById(req.params.id)
    if (findCategory) {
      return findCategory
    }
    return null
  } catch (err) {
    console.log(err)
    return null
  }
}

export const promptSubCategory = async (req: Request, res: Response) => {
  const findPromptSubCategory: any = await getData(
    req.params.id,
    req.params.timePeriod
  )
  if (findPromptSubCategory[0]) {
    const response: any = findPromptSubCategory

    return response
  }
  return null
}
export const addCategories = async (req: Request) => {
  try {
    const addSubCategories: AddSubCategoryType | undefined =
      await SubCategory.create({
        name: req.body.name,
        title: req.body.title,
        page_title: req.body.page_title,
        link: req.body.link,
        description: req.body.description,
        category_id: req.body.category_id,
      })
    if (addSubCategories) {
      return true
    }
    return null
  } catch (err) {
    console.log(err)
    return null
  }
}
