import { Router } from 'express'
import { auth } from "../../middlewares/auth.middleware.js"
import { validation } from "../../middlewares/validation.middleware.js"
import expressAsyncHandler from 'express-async-handler'
import * as companyController from './company.controller.js'
const router = Router()


router.post('/add', auth(), /*validation(),*/ expressAsyncHandler(companyController.addCompany))
router.put('/update', auth(), /*validation(),*/ expressAsyncHandler(companyController.updateCompany))
router.delete('/delete/:id', auth(), /*validation(),*/ expressAsyncHandler(companyController.deleteCompany))
router.get('/search', auth(), /*validation(),*/ expressAsyncHandler(companyController.searchForCompany))
router.get('/applications', auth(), /*validation(),*/ expressAsyncHandler(companyController.getApplications))
router.get('/:id', auth(), /*validation(),*/ expressAsyncHandler(companyController.getCompanyData))

//TODO: add authorization, validation

export default router