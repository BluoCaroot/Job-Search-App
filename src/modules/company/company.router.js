import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'

import { auth } from "../../middlewares/auth.middleware.js"
import { validation } from "../../middlewares/validation.middleware.js"
import * as companyController from './company.controller.js'
import { systemRoles } from '../../utils/systemRoles.js'
import * as companySchema from './company.validationSchema.js'

const router = Router()


router.post('/add', auth(systemRoles.HR), validation(companySchema.addCompanySchema), expressAsyncHandler(companyController.addCompany))
router.put('/update', auth(systemRoles.HR), validation(companySchema.updateCompanySchema), expressAsyncHandler(companyController.updateCompany))
router.delete('/delete/:id', auth(systemRoles.HR), validation(companySchema.deleteCompanySchema), expressAsyncHandler(companyController.deleteCompany))
router.get('/search', auth(), validation(companySchema.companySearchSchema), expressAsyncHandler(companyController.searchForCompany))
router.get('/applications', auth(systemRoles.HR), validation(companySchema.getApplicationsSchema), expressAsyncHandler(companyController.getApplications))
router.get('/:id', auth(systemRoles.HR), validation(companySchema.getCompanyDataSchema), expressAsyncHandler(companyController.getCompanyData))


export default router