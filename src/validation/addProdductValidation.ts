/* eslint-disable no-case-declarations */
import { NextFunction, Request, Response } from 'express'

export default function validatePrompt(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { prompt_type } = req.body

  if (!prompt_type) {
    return res.status(400).json({ error: 'prompt_type is required' })
  }

  // Validate compulsory fields
  const compulsoryFields = [
    'name',
    'price',
    'description',
    'prompt_type',
    'words',
    'tested',
    'tips',
    'hq_images',
    'product_id',
    'sub_category_id',
    'category_id',
  ]
  const missingFields = compulsoryFields.filter((field) => !req.body[field])

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Required fields are missing: ${missingFields.join(', ')}`,
    })
  }

  // Validate based on prompt type
  switch (prompt_type) {
    case 'gpt':
      const chatgptFields = [
        'type_gpt',
        'gpt_engine',
        'preview_input',
        'preview_output',
      ]
      const missingChatgptFields = chatgptFields.filter(
        (field) => !req.body[field]
      )

      if (missingChatgptFields.length > 0) {
        return res.status(400).json({
          error: `Required fields for prompt type "chatgpt" are missing: ${missingChatgptFields.join(
            ', '
          )}`,
        })
      }
      break

    case 'dalle':
      if (!req.body.image_verification_link) {
        return res.status(400).json({
          error:
            'Required field for prompt type "DALL-E" is missing: image_verification_link',
        })
      }
      break

    case 'midjourney':
      if (!req.body.midjourny_profile_link) {
        return res.status(400).json({
          error:
            'Required field for prompt type "Midjourney" is missing: midjourny_profile_link',
        })
      }
      break

    case 'stableDiffusion':
      const stableDiffusionFields = [
        'model',
        'sampler',
        'width',
        'height',
        'cfg_scale',
        'steps',
      ]
      const missingStableDiffusionFields = stableDiffusionFields.filter(
        (field) => !req.body[field]
      )

      if (missingStableDiffusionFields.length > 0) {
        return res.status(400).json({
          error: `Required fields for prompt type "stable diffusion" are missing: ${missingStableDiffusionFields.join(
            ', '
          )}`,
        })
      }
      break
    case 'promptbase':
      break
    default:
      return res.status(400).json({ error: 'Invalid prompt_type' })
  }

  // Continue to the next middleware/route handler
  next()
}
