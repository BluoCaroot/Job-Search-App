import { Router } from 'express'
import { auth } from "../../middlewares/auth.middleware.js"
import { validation } from "../../middlewares/validation.middleware.js"
import expressAsyncHandler from 'express-async-handler'
import * as jobController from './job.controller.js'
import { multerMiddleHost } from '../../middlewares/multer.js'
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import { fileCleaner } from '../../middlewares/fileCleaner.middleware.js'
import { systemRoles } from '../../utils/systemRoles.js'
const router = Router()


router.post('/add', auth(systemRoles.HR), /*validation(), */ expressAsyncHandler(jobController.addJob))
router.put('/update', auth(systemRoles.HR), /*validation(), */ expressAsyncHandler(jobController.updateJob))
router.delete('/remove/:id', auth(systemRoles.HR), /*validation(), */ expressAsyncHandler(jobController.removeJob))
router.get('/', auth(), /*validation(), */ expressAsyncHandler(jobController.getJobsWithCompany))
router.get('/company', auth(), /*validation(), */ expressAsyncHandler(jobController.getCompanyJobs))
router.post('/filter', auth(), /*validation(), */ expressAsyncHandler(jobController.filterJobs))
router.post('/apply/:jobId', auth(systemRoles.USER), multerMiddleHost(['pdf']).single('resume'), /*validation(), */
     expressAsyncHandler(jobController.applyToJob), fileCleaner)


//TODO: authorize and validate


export default router