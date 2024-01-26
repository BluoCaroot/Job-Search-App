import joi from 'joi'

import * as validation from '../../utils/validation.js'

const keys = 
{
    title: joi.string(),
    location: joi.string().valid('onSite', 'remote', 'hybrid'),
    workTime: joi.string().valid('partTime', 'fullTime'),
    seniorityLevel: joi.string().valid('junior', 'midLevel', 'Senior', 'teamLead', 'CTO'),
    skills: joi.array().items(validation.skillsSchema),
    id: joi.string().custom(validation.objectId)
}

export const addJobSchema = 
{
    body: joi.object(
    {
        title: keys.title,
        location: keys.location,
        workTime: keys.workTime,
        seniorityLevel: keys.seniorityLevel,
        techSkills: keys.skills,
        softSkills: keys.skills,
        company: keys.id
    }).required()
}
export const updateJobSchema =
{
    body: joi.object(
    {
        title: keys.title,
        location: keys.location,
        workTime: keys.workTime,
        seniorityLevel: keys.seniorityLevel,
        techSkills: keys.skills,
        softSkills: keys.skills,
        company: keys.id,
        id: keys.id.required()
    })
}
export const removeJobSchema =
{
    params:  joi.object(
    {
        id: keys.id.required()
    })
}
export const getCompanyJobsSchema =
{
    query: joi.object(
    {
        companyName: joi.string().required() 
    })
}
export const filterJobsSchema =
{
    query: joi.object(
    {
        workTime: keys.workTime,
        location: keys.location,
        seniorityLevel: keys.seniorityLevel,
        title: keys.title,
    }),
    body: joi.object(
    {
        techSkills: keys.skills
    })
}
export const applyToJobSchema =
{
    params: joi.object(
    {
        jobId: keys.id.required()
    })
}