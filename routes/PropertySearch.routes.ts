import express from 'express'
import { ViewListProperty, ViewListPropertyByMunicipality, ViewListPropertyByPostalCode } from '../controllers'

const router = express.Router()


router.get('/', ViewListProperty)
router.get('/postalcode/:key', ViewListPropertyByPostalCode)
router.get('/municipality/:key', ViewListPropertyByMunicipality)


export { router as PropertySearchRoute }
