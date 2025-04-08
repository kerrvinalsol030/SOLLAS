import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { MONGO_URI, PORT } from './config/config'
import { AdminRoutes, BoarderRoutes, PropertyOwnerRoutes, PropertySearchRoute, VerifierRoute } from './routes'
import path from 'path'




const app = express()



app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/images', express.static(path.join(__dirname, 'images')))



mongoose.connect(MONGO_URI).then(() =>
    console.log('connected')
).catch(err => console.log('error connecting to database'))


app.use('/admin', AdminRoutes)
app.use('/propertyOwner', PropertyOwnerRoutes)
app.use('/verifier', VerifierRoute)
app.use('/boarder', BoarderRoutes)
app.use(PropertySearchRoute)



app.listen(PORT, () => console.log(`APP is listening on PORT ${PORT}`))