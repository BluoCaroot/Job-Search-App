import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import twoFactor from 'node-2fa'

import User from '../../../DB/models/user.model.js'

/**
 * 
 * recieves key values of user to be created in the request body
 * checks for duplication of email and phone number returns error in case of duplication
 * otherwise creates a new user insatance and returns it with the secret 2fa key to be used incase of password reset
 */
export const signUp = async (req, res, next) =>
{
    const {firstName, lastName, recoveryEmail, dateOfBirth,
        phoneNumber, email, password, role, techSkills, softSkills} = req.body

    const duplicateEmail = await User.findOne({email})
    const duplicateNumber = await User.findOne({phoneNumber})

    if (duplicateEmail)
        return next(new Error('Email already exists', {cause: 409}))
    if (duplicateNumber)
        return next(new Error('Phone number already exists', {cause: 409}))
    
    const hashed = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)
    const userName = firstName + ' ' + lastName
    const newSecret = twoFactor.generateSecret({ name: "Job Search App", account: userName });


    const user = await User.create({firstName, lastName, userName ,
        recoveryEmail, dateOfBirth, phoneNumber, email, password: hashed, role, techSkills, softSkills,
        secret: newSecret.secret})
    res.status(201).json({message: 'user signed up sucessfully',
        note: "please scan this qr code or manually add the secret key to\
 any 2fa service to be able to reset your password",
        user, qrCode: newSecret.qr, secretKey: newSecret.secret})
}

/**
 * 
 * recieves password with either email or phone number in the request body
 * checks for validity login credintials and returns error in case of invalidity
 * otherwise returns a token for the logged in user 
 */
export const signIn = async (req, res, next) =>
{
    const {email, phoneNumber, password} = req.body

    
    const user = email ? await User.findOne({email}) : await User.findOne({phoneNumber})

    if (!user)
        return next(new Error('Invalid login credintials', {cause: 404}))
    
    const isPasswordCorrect = bcrypt.compareSync(password, user.password)
    if (!isPasswordCorrect)
        return next(new Error('Invalid login credintials', {cause: 404}))
    
    const token = jwt.sign(
    {
        id: user.id,
        userEmail: email
    }, process.env.LOGIN_SIGNATURE,
    {
        expiresIn: process.env.TOKEN_DURATION
    })
    user.status = 'online'
    user.save()
    return res.status(200).json({message: 'signed in successfully', token: process.env.TOKEN_PREFIX + token})
}
/**
 * 
 * recieves key values to be edited in the request body
 * checks for authorization and password and duplication of email and number 
 * returns error in case of any problem
 * otherwise edits the data as requested
 */
export const updateUser = async (req, res, next) =>
{
    const {user} = req
    const {firstName, lastName, dateOfBirth, phoneNumber, email, id, recoveryEmail, password} = req.body

    if (user._id.toString() != id)
        return next(new Error('Missing permissions to edit', {cause: 400}))

    const isPasswordCorrect = bcrypt.compareSync(password, user.password)
    if (!isPasswordCorrect)
        return next(new Error('Incorrect password', {cause: 400}))

    if (email)
    {
        const duplicateEmail = await User.findOne({email})
        if (duplicateEmail && duplicateEmail._id.toString() != id)
            return next(new Error('Email already exists', {cause: 409}))
        user.email = email
    }
    if (phoneNumber)
    {
        const duplicateNumber = await User.findOne({phoneNumber})
        if (duplicateNumber && duplicateNumber._id.toString() != id)
            return next(new Error('Phone number already exists', {cause: 409}))
            user.phoneNumber = phoneNumber
    }
    user.firstName = firstName ? firstName : user.firstName
    user.lastName = lastName ? lastName : user.lastName
    user.dateOfBirth = dateOfBirth ? dateOfBirth : user.dateOfBirth
    user.recoveryEmail = recoveryEmail ? recoveryEmail : user.recoveryEmail
    await user.save()
    
    res.status(200).json({message: "user updated successfully", user})
}
/**
 * 
 * recieves old and new password and id of user wishing to edit in the request body
 * returns error in case of incorrect password or unauthorization
 * otherwise changes password
 */
export const changePassword = async (req, res, next) =>
{
    const {user} = req
    const {password, oldPassword, id} = req.body

    if (user._id.toString() != id)
        return next(new Error('Missing permissions to edit', {cause: 400}))


    const isPasswordCorrect = bcrypt.compareSync(oldPassword, user.password)

    if (!isPasswordCorrect)
        return next(new Error('Incorrect password', {cause: 400}))

    user.password = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)
    await user.save()
    res.status(200).json({message: "password changed successfully"})
}
/**
 * 
 * recieves id and password of user to delete in the request body
 * returns error in case of incorrect password or unauthorization
 * otherwise deletes user
 */
export const deleteUser = async (req, res, next) =>
{
    const {user} = req
    const {id, password} = req.body

    if (user._id.toString() != id)
        return next(new Error('Missing permissions to delete', {cause: 400}))

    const isPasswordCorrect = bcrypt.compareSync(password, user.password)
    if (!isPasswordCorrect)
        return next(new Error('Incorrect password', {cause: 400}))


    await User.findByIdAndDelete(id)
    res.status(200).json({message: "user deleted successfully"})
}
/**
 * 
 * recieves id of the user whose data to get in the request params
 * returns error in case of unauthorization
 * otherwise returns user data
 */
export const getUserData = async (req, res, next) =>
{
    const {user} = req
    const {id} = req.params

    if (user._id.toString() != id)
        return next(new Error('Missing permissions to get data', {cause: 400}))

    res.status(200).json({message: "user data", user})
}
/**
 * 
 * recieves id of the user whose profile to view in the request params
 * returns error in case of invalid id
 * otherwise returns user profile
 */
export const viewUser = async (req, res, next) =>
{
    const {id} = req.params

    const user = await User.findById(id)
    if (!user)
        return next(new Error('Invalid id', {cause: 404}))
    
    const profile = {}
    profile.userName = user.userName
    profile.dateOfBirth = user.dateOfBirth
    profile.role = user.role
    profile.status = user.status
    profile.techSkills = user.techSkills
    profile.softSkills = user.softSkills

    res.status(200).json({message: "user profile", profile})
}


/**
 * 
 * recieves recovery email in the request body
 * returns a list of users using that recovery email
 */
export const getAllRecovery = async (req, res, next) =>
{
    const {recoveryEmail} = req.body
    const users = await User.find({recoveryEmail})

    res.status(200).json({message: `list of users with recovery email ${recoveryEmail}`, users})
}
/**
 * 
 * recieves otp token and email and new password in the request body
 * checks if the user exists and if the otp matches any token in the time window
 * returns error in case of any problem otherwise changes password and prompts user to log in
 */
export const forgotPassword = async (req, res, next) =>
{
    const {token, email, newPassword} = req.body

    const user = await User.findOne({email})
    if (!user)
        return next(new Error('Invalid email', {cause: 404}))
    const isTokenCorrect = twoFactor.verifyToken(user.secret, token)
    if (isTokenCorrect)
        return next(new Error('Invalid token', {cause: 400}))
    user.password = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS)
    await user.save()
    res.status(200).json({message: "Password reset you may login now"})
}