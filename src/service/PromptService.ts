import { Request, Response } from 'express'
import { Prompt } from '../models/Prompt'
import { Product } from '../models/Product'
import { View } from '../models/View'
import { Like } from '../models/Like'
import mongoose, { PipelineStage } from 'mongoose'
import { Buy } from '../models/Buy'

export const getMarketPlace = async (req: any, res: Response) => {
  const matchStage: any = {}

  const promptType = Array.isArray(req.query.prompt_type)
    ? req.query.prompt_type
    : [].concat(req.query.prompt_type)

  const productId = Array.isArray(req.query.product_id)
    ? req.query.product_id
    : [].concat(req.query.product_id)

  if (promptType[0] && !promptType.includes('all')) {
    matchStage.prompt_type = { $in: promptType }
  }

  if (productId[0] && productId[0] !== 'undefined') {
    const objectIdArray = productId.map(
      (id: string) => new mongoose.Types.ObjectId(id)
    )
    matchStage.product_id = { $in: objectIdArray }
  }

  if (req.query.sort === 'hottest') {
    const tenDaysAgo = new Date()
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)

    const hottest = await Prompt.aggregate([
      {
        $match: {
          created_at: { $gte: tenDaysAgo },
        },
      },
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: 'views',
          localField: '_id',
          foreignField: 'prompt_id',
          as: 'views',
        },
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'prompt_id',
          as: 'likes',
        },
      },
      {
        $addFields: {
          viewsCount: { $size: '$views' },
          likesCount: { $size: '$likes' },
          ratio: {
            $cond: [
              { $eq: [ { $size: '$likes' }, 0 ] },
              0,
              { $divide: [ { $size: '$views' }, { $size: '$likes' } ] },
            ],
          },
        },
      },
      {
        $project: {
          name: 1,
          _id: 1,
          price: 1,
          description: 1,
          prompt_type: 1,
          prompt_modal: 1,
          link: 1,
          landing_image_url: 1,
          created_at: {
            $dateToString: {
              format: '%Y-%m-%d %H:%M',
              date: '$created_at',
            },
          },
          viewsCount: 1,
          likesCount: 1,
          ratio: 1,
        },
      },
      {
        $sort: { ratio: -1, viewsCount: -1 },
      },
    ])
    return hottest
  } else if (req.query.sort === 'top') {
    const pipeline: PipelineStage[] = [
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: 'views',
          let: { promptId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$prompt_id', '$$promptId'] },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
          as: 'views',
        },
      },
      {
        $unwind: {
          path: '$views',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          count: { $ifNull: ['$views.count', 0] },
        },
      },
      {
        $project: {
          views: 0,
        },
      },
      {
        $project: {
          name: 1,
          _id: 1,
          price: 1,
          description: 1,
          prompt_type: 1,
          prompt_modal: 1,
          link: 1,
          landing_image_url: 1,
          created_at: {
            $dateToString: {
              format: '%Y-%m-%d %H:%M',
              date: '$created_at',
            },
          },
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]

    const update = await Prompt.aggregate(pipeline)
    return update
  } else {
    const pipeline = [
      {
        $match: matchStage,
      },
      {
        $project: {
          name: 1,
          _id: 1,
          price: 1,
          description: 1,
          prompt_type: 1,
          prompt_modal: 1,
          link: 1,
          landing_image_url: 1,
          created_at: {
            $dateToString: {
              format: '%Y-%m-%d %H:%M',
              date: '$created_at',
            },
          },
        },
      },
    ]

    const findPrompts: any = Prompt.aggregate(pipeline).sort({ created_at: -1 })

    if (findPrompts) {
      return findPrompts
    }
    return null
  
  }
}
export const getPromptCategory = async (req: any, res: Response) => {
  const matchStage: any = {}

  const promptType = Array.isArray(req.query.prompt_type)
    ? req.query.prompt_type
    : [].concat(req.query.prompt_type)

  if (promptType[0] && !promptType.includes('all')) {
    matchStage.prompt_type = { $in: promptType }
  }
  const pipeline: PipelineStage[] = [
    {
      $match: matchStage,
    },
    {
      $lookup: {
        from: 'products',
        localField: 'product_id',
        foreignField: '_id',
        as: 'products',
      },
    },
    {
      $unwind: '$products',
    },
    {
      $project: {
        product_name: '$products.name',
        product_id: '$products._id',
      },
    },
    {
      $group: {
        _id: '$product_id',
        product_name: { $first: '$product_name' },
      },
    },
  ]

  const findPrompts: any = Prompt.aggregate(pipeline).sort({ product_name: 1 })
  if (findPrompts) {
    return findPrompts
  } else return null
}
async function getData(timePeriod: string) {
  let query: any
  const currentDate = new Date()

  if (timePeriod === 'week') {
    const sevenDaysAgo = new Date(currentDate)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    query = Prompt.find({ created_at: { $gte: sevenDaysAgo } })
  } else if (timePeriod === 'month') {
    const pastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    )
    query = Prompt.find({
      created_at: {
        $gte: pastMonth,
        $lt: currentDate,
      },
    })
  } else if (timePeriod === 'feature') {
    const featureData: any = {}
    featureData.page_title =
      'DALL·E, GPT, Midjourney, Stable Diffusion, ChatGPT Prompt Marketplace'
    featureData.description =
      'Find top prompts, produce better results, save on API costs, sellyour own prompts.'
    featureData.prompts = await Prompt.find().limit(4)
    query = await featureData
  } else {
    query = Prompt.find()
  }

  return query
}
export const getPrompt = async (req: any, res: Response) => {
  const findPrompts: any = await getData(req.query.timePeriod)
  if (findPrompts) {
    return findPrompts
  }
  return null
}
export const getPromptById = async (req: Request, res: Response) => {
  const findPrompts: any = await Prompt.find({ _id: req.query.id })
  if (findPrompts) {
    return findPrompts[0]
  }
  return null
}
export async function addChatGPTPrompt(req: any) {
  try {
    // Create a new Prompt instance with the productData
    const prompt = new Prompt(req.body)
    prompt.landing_image_url = 'dev/Spiderman realistic Image/96719737.png'

    // Save the product to the database
    const savedPrompt = await prompt.save()
    const addPromptsModal: any = await Product.findByIdAndUpdate(
      req.body.product_id,
      { $push: { prompt_id: savedPrompt._id } }, // Replace with your new category_id value
      { new: true, upsert: true }
    )
    if (savedPrompt && addPromptsModal) {
      return true
    }
    // Return the saved product
    return null
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function addDALL_EPrompt(req: any) {
  try {
    // Create a new Prompt instance with the productData
    const prompt = new Prompt(req.body)
    prompt.landing_image_url = req.body.sample_images_url[0]
    // Save the product to the database
    const savedPrompt = await prompt.save()
    const addPromptsModal: any = await Product.findByIdAndUpdate(
      req.body.product_id,
      { $push: { prompt_id: savedPrompt._id } }, // Replace with your new category_id value
      { new: true, upsert: true }
    )
    if (savedPrompt && addPromptsModal) {
      return true
    }
    // Return the saved product
    return null
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function addMidjourneyPrompt(req: any) {
  try {
    // Create a new Prompt instance with the productData
    const prompt = new Prompt(req.body)
    prompt.landing_image_url = req.body.sample_images_url[0]
    // Save the product to the database
    const savedPrompt = await prompt.save()
    const addPromptsModal: any = await Product.findByIdAndUpdate(
      req.body.product_id,
      { $push: { prompt_id: savedPrompt._id } }, // Replace with your new category_id value
      { new: true, upsert: true }
    )
    if (savedPrompt && addPromptsModal) {
      return true
    }
    // Return the saved product
    return null
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function addStableDiffusionPrompt(req: any) {
  try {
    // Create a new Prompt instance with the productData
    const prompt = new Prompt(req.body)
    prompt.landing_image_url = req.body.sample_images_url[0]
    // Save the product to the database
    const savedPrompt = await prompt.save()
    const addPromptsModal = await Product.findByIdAndUpdate(
      req.body.product_id,
      { $push: { prompt_id: savedPrompt._id } }, // Replace with your new category_id value
      { new: true, upsert: true }
    )
    if (savedPrompt && addPromptsModal) {
      return true
    }

    // Return the saved product
    return null
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function addPromptbasePrompt(req: any) {
  try {
    // Create a new Prompt instance with the productData
    const prompt = new Prompt(req.body)
    prompt.landing_image_url = req.body.sample_images_url[0]
    // Save the product to the database
    const savedPrompt = await prompt.save()
    const addPromptsModal: any = await Product.findByIdAndUpdate(
      req.body.product_id,
      { $push: { prompt_id: savedPrompt._id } }, // Replace with your new category_id value
      { new: true, upsert: true }
    )
    if (savedPrompt && addPromptsModal) {
      return true
    }

    // Return the saved product
    return null
  } catch (err) {
    return null
  }
}

export const addPrompts = async (req: any, res: Response) => {
  try {
    if (req.files) {
      const addPrompts = await Product.create({
        name: req.body.name,
      })
      const addPromptsModal = await Product.findByIdAndUpdate(
        req.body.product_id,
        { $push: { prompt_id: addPrompts._id } }, // Replace with your new category_id value
        { new: true, upsert: true }
      )

      if (addPrompts && addPromptsModal) {
        return true
      }
    }
    const addPrompts = await Product.create({
      name: req.body.name,
    })

    const addPromptsModal = await Product.findByIdAndUpdate(
      req.body.product_id,
      { $push: { sub_category_id: addPrompts._id } }, // Replace with your new category_id value
      { new: true, upsert: true }
    )

    if (addPrompts && addPromptsModal) {
      return true
    }
    return null
  } catch (err) {
    console.log(err)
    return null
  }
}

export const AddView = async (req: any, id: string) => {
  try {
    if (
      (req.headers.userfingerprint &&
        req.headers.userfingerprint !== 'admin_device') ||
      req.user._id
    ) {
      const firebird = await View.updateOne(
        {
          user_id: req.headers.userfingerprint || req.user._id,
          prompt_id: new mongoose.Types.ObjectId(id),
        },
        {
          $setOnInsert: {
            user_id: req.headers.userfingerprint || req.user._id,
            prompt_id: new mongoose.Types.ObjectId(id),
          },
        },
        { upsert: true }
      )
        .exec()
        .then(async (result: mongoose.UpdateWriteOpResult) => {
          if (result.upsertedCount) {
            const update = await View.count({
              prompt_id: new mongoose.Types.ObjectId(id),
            })
            return update
          } else {
            const update = await View.count({
              prompt_id: new mongoose.Types.ObjectId(id),
            })
            return update
          }
        })
        .catch((error) => {
          console.error('An error occurred:', error)
          return null
        })
      return firebird
    }
    const update = await View.count({
      prompt_id: new mongoose.Types.ObjectId(id),
    })
    return update
  } catch (err) {
    console.log(err)
    return null
  }
}

export const LikeCount = async (req: any, id: string) => {
  try {
    const likes = await Like.count({
      prompt_id: new mongoose.Types.ObjectId(id),
    })
      .then((count: number) => {
        if (count > 0) {
          return count
        } else {
          return count
        }
      })
      .catch((error) => {
        console.error(error)
        return null
      })
    return likes
  } catch (err) {
    console.log(err)
    return null
  }
}

export const LikedOrNot = async (req: any, id: string) => {
  try {
    if (!req.user) {
      return false
    } else {
      const likes = await Like.count({
        user_id: new mongoose.Types.ObjectId(req.user._id),
        prompt_id: new mongoose.Types.ObjectId(id),
      })
        .then((match: number) => {
          if (match) {
            return true
          } else {
            return false
          }
        })
        .catch((error) => {
          console.error(error)
          return null
        })
      return likes
    }
  } catch (err) {
    console.log(err)
    return null
  }
}

export const selledCount = async (req: any, id: string) => {
  try {
    const likes = await Buy.count({
      prompt_id: new mongoose.Types.ObjectId(id),
    })
      .then((match: number) => {
        if (match) {
          return match
        } else {
          return 0
        }
      })
      .catch((error) => {
        console.error(error)
        return null
      })
    return likes
  } catch (err) {
    console.log(err)
    return null
  }
}
