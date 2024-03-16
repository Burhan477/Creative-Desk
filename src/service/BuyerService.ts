import { Buy } from '../models/Buy'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

/**Get Buyer services
 * @author:  aniket.trapasiya<aniket.trapasiya@dataprophets.in>
 * @description:GET Buyer details.
 * @return: all Buyer list.
 */
export const detail = async (req: any) => {
  const findProduct = await Buy.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'users',
      },
    },
    {
      $unwind: '$users',
    },
    {
      $lookup: {
        from: 'prompts',
        localField: 'prompt_id',
        foreignField: '_id',
        as: 'prompts',
      },
    },
    {
      $unwind: '$prompts',
    },

    {
      $lookup: {
        from: 'payments',
        localField: 'transaction_id',
        foreignField: '_id',
        as: 'payments',
      },
    },
    {
      $unwind: '$payments',
    },
    {
      $group: {
        _id: '$user_id',
        username: { $first: '$users.name' },
        email: { $first: '$users.email' },
        poster: { $first: '$users.poster' },
        profile_url: { $first: '$users.profile_url' },
        promptsList: {
          $push: {
            prompt_id: '$prompt_id',
            name: '$prompts.name',
            landing_image_url: '$prompts.landing_image_url',
            description: '$prompts.description',
            transaction_id: '$transaction_id',
            order_id: '$payments.razorpayDetails.orderId',
            amount: '$payments.razorpayDetails.amount',
            status: '$payments.razorpayDetails.status',
            transaction_date: {
              $dateToString: {
                format: '%Y-%m-%d %H:%M',
                date: '$payments.created_at',
              },
            },
            prompt_created_at: {
              $dateToString: {
                format: '%Y-%m-%d %H:%M',
                date: '$prompts.created_at',
              },
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        email: 1,
        poster: 1,
        profile_url: 1,
        promptsList: 1,
      },
    },
  ])
  if (findProduct) {
    return findProduct
  } else {
    return null
  }
}
