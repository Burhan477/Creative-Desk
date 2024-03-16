import { SubCategory } from '../models/SubCategory'

export const seedCategories = async () => {
  try {
    const categories = [
      { name: 'Category 1' },
      { name: 'Category 2' },
      { name: 'Category 3' },
    ]

    await SubCategory.insertMany(categories)

    console.log('Categories seeded successfully!')
  } catch (error) {
    console.error('Error seeding categories:', error)
  }
}
