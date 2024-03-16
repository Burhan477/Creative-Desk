import { Prompt } from '../models/Prompt'

export const seedProducts = async () => {
  try {
    const products = [
      { name: 'Product 1', price: 10, categoryId: 'category1Id' },
      { name: 'Product 2', price: 20, categoryId: 'category2Id' },
      { name: 'Product 3', price: 30, categoryId: 'category3Id' },
    ]

    await Prompt.insertMany(products)

    console.log('Products seeded successfully!')
  } catch (error) {
    console.error('Error seeding products:', error)
  }
}
