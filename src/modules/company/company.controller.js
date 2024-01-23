import Company from '../../../DB/models/company.model.js'

export const addCompany = async (req, res, next) =>
{
    const {name, description, industry, address, companySize, email, hr} = req.body

    const duplicateEmail = await Company.findOne({email})
    const duplicateName = await Company.findOne({name})
    if (duplicateEmail)
        return next(new Error('Email already exists', {cause: 409}))
    if (duplicateName)
        return next(new Error('Company name already exists', {cause: 409}))
    const company = await Company.create({name, description, industry, address, companySize, email, hr})
    res.status(201).json({message: 'Company created sucessfully', company})

}

export const updateCompany = async (req, res, next) =>
{
    const {user} = req
    const {name, description, industry, address, companySize, email, id} = req.body

    const company = await Company.findById(id)
    if (company.hr.tostring() != user._id.tostring())
        return next(new Error('Missing permissions to edit', {cause: 400}))

    company.description = description ? description : company.description
    company.industry = industry ? industry : company.industry
    company.address = address ? address : company.address
    company.companySize = companySize ? companySize : company.companySize
    
    if (email)
    {
        const duplicateEmail = await Company.findOne({email})
        if (duplicateEmail)
        return next(new Error('Email already exists', {cause: 409}))
        company.email = email
    }
    if (name)
    {
        const duplicateName = await Company.findOne({name})
        if (duplicateName)
            return next(new Error('Company name already exists', {cause: 409}))
        company.name = name
    }
    res.status(200).json({message: "Edited company data"})
}

export const deleteCompany = async (req, res, next) =>
{
    const {user} = req
    const {id} = req.params

    const company = await Company.findById(id)
    if (company.hr.tostring() != user._id.tostring())
        return next(new Error('Missing permissions to delete', {cause: 400}))

    await Company.findByIdAndDelete(id)
    res.status(200).json({message: "Deleted company"})
}