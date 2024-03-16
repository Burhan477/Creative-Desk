export async function up(db: any): Promise<void> {
  // Create the "users" collection

  // Get the Mongoose model for the "users" collection
  const users: any = [
    {
      name: 'John Doe',
      role: 'admin',
      email: 'john@example.com',
      password: '$2a$10$ijncKBEq/Anp8g6Lh8/PNuBUmciMNX6En87t1pFqYr9dnYoP/PZ5i',
    },
    {
      name: 'Jane Smith',
      role: 'user',
      email: 'jane@example.com',
      password: '$2a$10$ijncKBEq/Anp8g6Lh8/PNuBUmciMNX6En87t1pFqYr9dnYoP/PZ5i',
    },
  ]
  try {
    await db.collection('users').insertMany(users)
  } catch (err) {
    console.log(err, 'error')
    throw err
  }

  // Optionally, add any initial data or perform additional database operations
  // For example:
  // await User.insertMany([
  //   { name: 'John', age: 25 },
  //   { name: 'Jane', age: 30 },
  // ]);
}

export async function down(db: any): Promise<void> {
  // Drop the "users" collection
  await db.collection('users').drop()
}
