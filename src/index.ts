// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose, { ConnectOptions } from 'mongoose'
import routes from './routes'
import helmet from 'helmet'

const app = express()
const port = process.env.PORT || 80 || '0.0.0.0'

// Connect to MongoDB
mongoose
  .connect(
    process.env.DB_SAMPLE_URL as any,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions
  )
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  })

// Define routes and middleware
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: false,
    parameterLimit: 50000,
  })
)
app.use('/api', routes)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
