import { User } from '../models/User'

export const seedUser = async () => {
  try {
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password:
          '$2a$10$ijncKBEq/Anp8g6Lh8/PNuBUmciMNX6En87t1pFqYr9dnYoP/PZ5i',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password:
          '$2a$10$ijncKBEq/Anp8g6Lh8/PNuBUmciMNX6En87t1pFqYr9dnYoP/PZ5i',
      },
    ]

    await User.insertMany(users)

    console.log('Users seeded successfully!')
  } catch (error) {
    console.error('Error seeding Users:', error)
  }
}
