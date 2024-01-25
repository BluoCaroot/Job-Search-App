import joi from 'joi'

const constants = 
{
    roles: joi.string().valid('user', 'hr'),

}

export const signUpSchema = {
    body: joi.object(
    {
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        email: joi.string().email().required(),
        recoveryEmail: joi.string().email(),  
        password: joi.string().required(),
        confirmPassword: joi.string().valid(joi.ref('password')),
        role:,
        techSkills:,
        softSkills:,

    })
    .with('password', 'confirmPassword')
}
