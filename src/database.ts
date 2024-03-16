// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
import mongoose, { ConnectOptions } from 'mongoose'

const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.DB_SAMPLE_URL as any,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      } as ConnectOptions
    )
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
  }
}

connectToDatabase()
