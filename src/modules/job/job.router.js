import { Router } from 'express'
import { auth } from "../../middlewares/auth.middleware.js"
import { validation } from "../../middlewares/validation.middleware.js"
import expressAsyncHandler from 'express-async-handler'
import * as jobController from './job.controller.js'
import { multerMiddleHost } from '../../middlewares/multer.js'
import * as jobSchema from './job.validationSchema.js'
import { fileCleaner } from '../../middlewares/fileCleaner.middleware.js'
import { systemRoles } from '../../utils/systemRoles.js'
const router = Router()


router.post('/add', auth(systemRoles.HR), validation(jobSchema.addJobSchema),  expressAsyncHandler(jobController.addJob))
router.put('/update', auth(systemRoles.HR), validation(jobSchema.updateJobSchema),  expressAsyncHandler(jobController.updateJob))
router.delete('/remove/:id', auth(systemRoles.HR), validation(jobSchema.removeJobSchema),  expressAsyncHandler(jobController.removeJob))
router.get('/', auth(), expressAsyncHandler(jobController.getJobsWithCompany))
router.get('/company', auth(), validation(jobSchema.getCompanyJobsSchema),  expressAsyncHandler(jobController.getCompanyJobs))
router.post('/filter', auth(), validation(jobSchema.filterJobsSchema),  expressAsyncHandler(jobController.filterJobs))
router.post('/apply/:jobId', auth(systemRoles.USER), multerMiddleHost(['pdf']).single('resume'), validation(jobSchema.applyToJobSchema), 
     expressAsyncHandler(jobController.applyToJob), fileCleaner)




export default router