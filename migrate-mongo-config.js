require('dotenv').config()

// eslint-disable-next-line no-undef
module.exports = {
  mongodb: {
    url: process.env.DB_SAMPLE_URL, // Replace with your MongoDB connection URL
    databaseName: process.env.DB_NAME, // Replace with your database name
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'dist/migrations',
  seedsDir: 'dist/seeders',
  changelogCollectionName: 'changelog',
}
