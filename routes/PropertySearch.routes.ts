import express from 'express'
import { PropertySearchById, ViewListProperty, ViewListPropertyByMunicipality, ViewListPropertyByPostalCode } from '../controllers'
import { Authenticate } from '../middlewares/Authentication'

const router = express.Router()

router.get('/', ViewListProperty)
router.get('/postalcode/:key', ViewListPropertyByPostalCode)
router.get('/municipality/:key', ViewListPropertyByMunicipality)

router.use(Authenticate)
router.get('/:propertyId', PropertySearchById)



export { router as PropertySearchRoute }
