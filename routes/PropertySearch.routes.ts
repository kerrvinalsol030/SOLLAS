import express from 'express'
import { ViewListProperty, ViewListPropertyByMunicipality, ViewListPropertyByPostalCode } from '../controllers'
import { Authenticate } from '../middlewares/Authentication'

const router = express.Router()

router.use(Authenticate)

router.get('/', ViewListProperty)
router.get('/postalcode/:key', ViewListPropertyByPostalCode)
router.get('/municipality/:key', ViewListPropertyByMunicipality)


export { router as PropertySearchRoute }
