import * as userController from './user.controller.js'
import { Router } from 'express'
import { auth } from "../../middlewares/auth.middleware.js"
import { validation } from "../../middlewares/validation.middleware.js"
import expressAsyncHandler from 'express-async-handler'
const router = Router()


router.post('/signup', /*validation(),*/ expressAsyncHandler(userController.signUp))
router.post('/signin', /*validation(),*/ expressAsyncHandler(userController.signIn))
router.put('/update', auth(), /*validation(),*/ expressAsyncHandler(userController.updateUser))
router.delete('/delete', auth(), /*validation(),*/ expressAsyncHandler(userController.deleteUser))
router.patch('/password', auth(), /*validation(),*/ expressAsyncHandler(userController.changePassword))
router.get('/data/:id', auth(), /*validation(),*/ expressAsyncHandler(userController.getUserData))
router.get('/profile/:id', /*validation(),*/ expressAsyncHandler(userController.viewUser))
router.get('/recovery', /*validation(),*/ expressAsyncHandler(userController.getAllRecovery))
//TODO: add otp API(s)

export default router