import Company from '../../../DB/models/company.model.js'
import Job from '../../../DB/models/job.model.js'
import Application from '../../../DB/models/application.model.js'


/**
 * 
 * recieves key values for the company in the request body
 * creates a new company instance and returns it in case of succes
 * 
 * in case of duplicate name or email returns an error
 */

export const addCompany = async (req, res, next) =>
{
    const {user} = req
    const {name, description, industry, address, companySize, email} = req.body

    const duplicateEmail = await Company.findOne({email})
    const duplicateName = await Company.findOne({name})
    if (duplicateEmail)
        return next(new Error('Email already exists', {cause: 409}))
    if (duplicateName)
        return next(new Error('Company name already exists', {cause: 409}))
    const company = await Company.create({name, description, industry, address, companySize, email, hr: user._id})
    res.status(201).json({message: 'Company created sucessfully', company})

}

/**
 * 
 * recieves key values to be edited in the request body
 * checks for valid id and duplication of email and name
 * 
 * in case of duplication or invalidity returns an error
 */

export const updateCompany = async (req, res, next) =>
{
    const {user} = req
    const {name, description, industry, address, companySize, email, id} = req.body

    const company = await Company.findById(id)
    if (!company)
        return next(new Error('Invalid id', {cause: 404}))
    if (company.hr.toString() != user._id.toString())
        return next(new Error('Missing permissions to edit', {cause: 400}))

    company.description = description ? description : company.description
    company.industry = industry ? industry : company.industry
    company.address = address ? address : company.address
    company.companySize = companySize ? companySize : company.companySize
    
    if (email)
    {
        const duplicateEmail = await Company.findOne({email})
        if (duplicateEmail && duplicateEmail._id.toString() != id)
        return next(new Error('Email already exists', {cause: 409}))
        company.email = email
    }
    if (name)
    {
        const duplicateName = await Company.findOne({name})
        if (duplicateName && duplicateName._id.toString() != id)
            return next(new Error('Company name already exists', {cause: 409}))
        company.name = name
    }
    await company.save()
    res.status(200).json({message: "Edited company data"})
}
/**
 * 
 * recieves id of company to delete in request params
 * returns error in case of invalid id or unauthorization otherwise deletes company
 */
export const deleteCompany = async (req, res, next) =>
{
    const {user} = req
    const {id} = req.params

    const company = await Company.findById(id)
    if (!company)
        return next(new Error('Invalid id', {cause: 404}))
    if (company.hr.toString() != user._id.toString())
        return next(new Error('Missing permissions to delete', {cause: 400}))

    await Company.findByIdAndDelete(id)
    res.status(200).json({message: "Deleted company"})
}
/**
 * 
 * recieves id of company to get data in request params
 * returns error in case of invalid id otherwise gets company data
 */
export const getCompanyData = async (req, res, next) =>
{
    const {id} = req.params

    const company = await Company.findById(id)
    if (!company)
        return next(new Error('Invalid id', {cause: 404}))
    const jobs =  await Job.find({company: id})
    
    res.status(200).json({message: "company and it's jobs", company, jobs})
}
/**
 * 
 * recieves prefix to search with in request query
 * returns companies matching search criteria
 */
export const searchForCompany = async (req, res, next) =>
{
    const {prefix} = req.query

    const regex = new RegExp(`^${prefix}`, 'i')

    const companies = await Company.find({name: regex})

    res.status(200).json({message: "companies matching search criteria", companies})
}

/**
 * 
 * recieves id of company to get applications for in request query
 * returns error in case of invalid id or unauthorization otherwise returns applications
 */
export const getApplications = async (req, res, next) =>
{
    const {user} = req
    const {companyId} = req.query


    const company = await Company.findById(companyId)
    if (!company)
        return next(new Error('Invalid company id', {cause: 404}))
    if (user._id.toString() != company.hr.toString())
        return next(new Error('Missing permissions to access applications', {cause: 400}))
        
    const jobs = await Job.find({company: companyId})
    const applications = []
    for (const job of jobs)
    {
        const application = await Application.find({jobId: job._id}).populate('userId')
        applications.push(application)
    }

    res.status(200).json({message: "list of applications", applications: applications})
}