import joi from 'joi'
import * as validation from '../../utils/validation.js'

const keys = 
{
    name: joi.string(),
    description: joi.string(),
    industry: joi.string(),
    address: joi.string(),
    companySize: joi.string().valid("less than 10", "11-20", "21-50", "50+"),
    email: joi.string().email(),
    id: joi.string().custom(validation.objectId)
}

export const addCompanySchema = 
{
    body: joi.object(
    {
        name: keys.name,
        description: keys.description,
        industry: keys.industry,
        address: keys.address,
        companySize: keys.companySize,
        email: keys.email
    }).required()
}


export const updateCompanySchema = 
{
    body: joi.object(
    {
        name: keys.name,
        description: keys.description,
        industry: keys.industry,
        address: keys.address,
        companySize: keys.companySize,
        email: keys.email,
        id: keys.id.required()
    })
}
export const deleteCompanySchema =
{
    params: joi.object(
    { 
        id: keys.id.required()
    })
}
export const getCompanyDataSchema =
{
    params: joi.object(
    { 
        id: keys.id.required()
    })
}
export const companySearchSchema = 
{
    query: joi.object(
    {
        prefix: joi.string().required()
    })
}
export const getApplicationsSchema =
{
    query: joi.object(
    {
        companyID: keys.id.required()
    })
}