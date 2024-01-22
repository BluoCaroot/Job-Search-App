import * as userController from './user.controller.js'
import { Router } from 'express'
import { auth } from "../../middlewares/auth.middleware.js"
import { validation } from "../../middlewares/validation.middleware.js"
import expressAsyncHandler from 'express-async-handler'
const router = Router()


router.post('/signup', /*validation(),*/ expressAsyncHandler(userController.signUp))
router.post('/signin', /*validation(),*/ expressAsyncHandler(userController.signIn))
router.put('/update',auth(), /*validation(),*/ expressAsyncHandler(userController.updateUser))
router.delete('/delete', auth(), /*validation(),*/ expressAsyncHandler(userController.deleteUser))

export default router