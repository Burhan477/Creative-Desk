import { Prompt } from '../models/Prompt'

export const seedItems = async () => {
  try {
    const items = [
      { name: 'Item 1', description: 'Description 1', productId: 'product1Id' },
      { name: 'Item 2', description: 'Description 2', productId: 'product2Id' },
      { name: 'Item 3', description: 'Description 3', productId: 'product3Id' },
    ]

    await Prompt.insertMany(items)

    console.log('Items seeded successfully!')
  } catch (error) {
    console.error('Error seeding items:', error)
  }
}
