import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT

export const MONGO_URI = process.env.MONGO_URI || 'null'

export const APP_SECRET = process.env.APP_SECRET || 'null'