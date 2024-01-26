import joi from 'joi'


export const signUpSchema = {
    body: joi.object(
    {
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        email: joi.string().email().required(),
        recoveryEmail: joi.string().email(),  
        password: joi.string().required(),
        confirmPassword: joi.string().valid(joi.ref('password')),
        role: joi.string().valid('user', 'hr'),
        techSkills: joi.array(),
        softSkills: joi.array(),

    })
    .with('password', 'confirmPassword')
}
