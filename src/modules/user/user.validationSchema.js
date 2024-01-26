import joi from 'joi'
import * as validation from '../../utils/validation.js'

const customDateValidator = (value, helpers) =>
{
    const regex = /^\d{4}-\d{2}-\d{2}$/
  
    if (!regex.test(value)) 
      return helpers.error('any.invalid')
    
    return value
}

const keys = 
{
    firstName: joi.string(),
    lastName: joi.string(),
    email: joi.string().email(),
    recoveryEmail: joi.string().email(),  
    password: joi.string(),
    confirmPassword: joi.string().valid(joi.ref('password')),
    role: joi.string().valid('user', 'hr'),
    skills: joi.array(),
    phoneNumber: joi.string().min(8).max(16),
    dateOfBirth: joi.custom(customDateValidator),
    id: joi.string().custom(validation.objectId)
}


export const signUpSchema =
{
    body: joi.object(
    {
        firstName: keys.firstName.required(),
        lastName: keys.lastName.required(),
        email: keys.lastName.required(),
        recoveryEmail: keys.recoveryEmail,  
        password: keys.password.required(),
        confirmPassword: joi.string().valid(joi.ref('password')),
        role: keys.role.required(),
        techSkills: keys.skills,
        softSkills: keys.skills,
        phoneNumber: keys.phoneNumber.required(),
        dateOfBirth: keys.dateOfBirth

    })
    .with('password', 'confirmPassword')
}

export const logInSchema =
{
    body: joi.object(
    {
        email: keys.email,
        password: keys.password.required(),
        phoneNumber: keys.phoneNumber,
    }).xor('email', 'phoneNumber')
}

export const updateUserSchema =
{
    body: joi.object(
    {
        firstName: keys.firstName,
        lastName: keys.lastName,
        email: keys.lastName,
        recoveryEmail: keys.recoveryEmail,  
        password: keys.password.required(),
        role: keys.role,
        phoneNumber: keys.phoneNumber,
        dateOfBirth: keys.dateOfBirth,
        id: keys.id.required()
    })
}
export const deleteUserSchema =
{
    body: joi.object(
    { 
        password: keys.password,
        id: keys.id
    }).required()
}
export const changePasswordSchema = 
{
    body: joi.object(
    {
        password: keys.password,
        oldPassword: keys.password,
        id: keys.id
    }).required()
}
export const forgetPasswordSchema = 
{
    body: joi.object(
    {
        token: joi.number().min(100000).max(999999).integer(),
        email: keys.email,
        newPassword: keys.password
    }).required()
}
export const getUserDataSchema =
{
    params: joi.object(
    {
        id: keys.id
    }).required()
}

export const getUserRecoverySchema =
{
    body: joi.object(
    {
        recoveryEmail: keys.email.required()
    })
}