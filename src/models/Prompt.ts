import mongoose, { Schema, Document } from 'mongoose'

// export interface PromptType extends Document {
//   name: string
//   price: number
//   description: string
//   prompt_type: string
//   prompt_modal: string
//   landing_image_url: string
//   sample_images_url: string[]
//   words: number
//   tested: boolean
//   tips: boolean
//   hq_images: boolean
//   prompt: string
//   link: string
//   testing_prompt: string
//   prompt_instruction: string
//   image_verification_link: string
//   midjourny_profile_link: string
//   type_gpt: string
//   gpt_engine: string
//   preview_input: string
//   preview_output: string
//   model: string
//   sampler: string
//   width: number
//   height: number
//   cfg_scale: number
//   steps: number
//   seeds: string
//   CLIP_guidence: boolean
//   negative_prompt: string
//   category_id: mongoose.Types.ObjectId
//   sub_category_id: mongoose.Types.ObjectId
//   product_id: mongoose.Types.ObjectId
//   prompt_details: Record<string, unknown>
//   created_at: Date
// }

const PromptSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  prompt_type: { type: String, required: true },
  link: { type: String, required: true, unique: true },
  prompt_modal: { type: String, required: true },
  landing_image_url: { type: String, required: false },
  sample_images_url: [{ type: String, required: false }],
  // subtitle fields
  words: { type: Number, required: true },
  tested: { type: Boolean, required: true },
  tips: { type: Boolean, required: true },
  hq_images: { type: Boolean, required: true },
  // refferenced fields
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  prompt: { type: Schema.Types.String, required: true },
  testing_prompt: { type: Schema.Types.String, required: true },
  prompt_instruction: { type: Schema.Types.String, required: true },
  image_verification_link: { type: Schema.Types.String, required: false },
  midjourny_profile_link: { type: Schema.Types.String, required: false },
  type_gpt: { type: Schema.Types.String, required: false },
  gpt_engine: { type: Schema.Types.String, required: false },
  preview_input: { type: Schema.Types.String, required: false },
  preview_output: { type: Schema.Types.String, required: false },
  model: { type: Schema.Types.String, required: false },
  sampler: { type: Schema.Types.String, required: false },
  width: { type: Schema.Types.String, required: false },
  height: { type: Schema.Types.String, required: false },
  cfg_scale: { type: Schema.Types.String, required: false },
  steps: { type: Schema.Types.String, required: false },
  seeds: { type: Schema.Types.String, required: false },
  CLIP_guidence: { type: Schema.Types.String, required: false },
  negative_prompt: { type: Schema.Types.String, required: false },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'categories',
    required: true,
  },
  sub_category_id: {
    type: Schema.Types.ObjectId,
    ref: 'subcategories',
    required: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'products',
    required: true,
  },
  prompt_details: {
    type: Schema.Types.Mixed,
    required: false,
    default: {},
  },
  created_at: {
    type: Schema.Types.Date,
    default: Date.now,
  },
})

export const Prompt = mongoose.model<any>('prompts', PromptSchema)
