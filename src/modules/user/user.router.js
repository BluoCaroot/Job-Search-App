import * as userController from './user.controller.js'
import { Router } from 'express'
import { auth } from "../../middlewares/auth.middleware.js"
import { validation } from "../../middlewares/validation.middleware.js"
import expressAsyncHandler from 'express-async-handler'
import * as userSchema from './user.validationSchema.js'
const router = Router()


router.post('/signup', validation(userSchema.signUpSchema), expressAsyncHandler(userController.signUp))
router.post('/signin', validation(userSchema.logInSchema), expressAsyncHandler(userController.signIn))
router.put('/update', auth(), validation(userSchema.updateUserSchema), expressAsyncHandler(userController.updateUser))
router.delete('/delete', auth(), validation(userSchema.deleteUserSchema), expressAsyncHandler(userController.deleteUser))
router.patch('/password', auth(), validation(userSchema.changePasswordSchema), expressAsyncHandler(userController.changePassword))
router.get('/data/:id', auth(), validation(userSchema.getUserDataSchema), expressAsyncHandler(userController.getUserData))
router.get('/profile/:id', validation(userSchema.getUserDataSchema), expressAsyncHandler(userController.viewUser))
router.get('/recovery', validation(userSchema.getUserRecoverySchema), expressAsyncHandler(userController.getAllRecovery))
router.patch('/forget', validation(userSchema.forgetPasswordSchema), expressAsyncHandler(userController.forgotPassword))

export default router