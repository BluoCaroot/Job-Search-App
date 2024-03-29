import Job from './../../../DB/models/job.model.js'
import Company from './../../../DB/models/company.model.js'
import Application from './../../../DB/models/application.model.js'
import { cloudinaryConnection } from '../../utils/cloudinaryConnection.js'
import * as Cloudinary from '../../utils/cloudinaryFunctions.js'

/**
 * 
 * recieves key values of job to add in the request body
 * checks for validity of company id and returns an error in case of invalidity or unauthorization
 * otherwise creates a new job instance and returns it
 */

export const addJob = async (req, res, next) =>
{
    const {user} = req
    const {title, location, workTime, seniorityLevel, techSkills, softSkills, company} = req.body

    const isCompanyIdValid = await Company.findById(company)
    if (!isCompanyIdValid)
        return next(new Error("Invalid company id", {cause: 404}))
    if (isCompanyIdValid.hr.toString() != user._id)
         next(new Error("Missing permission to add jobs to this company", {cause: 400}))

    const job = await Job.create({title, location, workTime, seniorityLevel, techSkills, softSkills, company, addedBy: user._id})

    res.status(201).json({message: "Job listed", job})
}

/**
 * 
 * recieves key values to edit in the request body
 * checks for duplication and invalidity of ids and authorization and returns an error in case of any problems
 * otherwise edits the job as requested
 */

export const updateJob = async (req, res, next) =>
{
    const {user} = req
    const {title, location, workTime, seniorityLevel, techSkills, softSkills, company, id} = req.body

    const job = await Job.findById(id)

    if (!job)
        return next(new Error("Invalid job id", {cause: 404}))
    if (job.addedBy != user._id.toString())
        return next(new Error("Missing permission to edit", {cause: 400}))

    if (company)
    {
        const isCompanyIdValid = await Company.findById(company)
        if (!isCompanyIdValid)
            return next(new Error("Invalid company id", {cause: 404}))
        if (isCompanyIdValid.hr.toString() != user._id)
            return next(new Error("Missing permission to add jobs to this company", {cause: 400}))
        job.company = company
    }
    job.title = title ? title : job.title
    job.location = location ? location : job.location
    job.workTime = workTime ? workTime : job.workTime
    job.seniorityLevel = seniorityLevel ? seniorityLevel : job.seniorityLevel
    job.techSkills = techSkills ? techSkills : job.techSkills
    job.softSkills = softSkills ? softSkills : job.softSkills
    
    await job.save()
    res.status(200).json({message: "Job edited"})
}
/**
 * 
 * recieves id of job to delete in request params
 * returns error in case of invalid id or unauthorization
 * otherwise removes resumes related to the job from the host and deletes the job
 */
export const removeJob = async (req, res, next) =>
{
    const {user} = req
    const {id} = req.params

    const job = await Job.findById(id)

    if (!job)
        return next(new Error("Invalid job id", {cause: 404}))
    if (job.addedBy != user._id.toString())
        return next(new Error("Missing permission to delete", {cause: 400}))

    const applications = await Application.find({jobId: id})

    await cloudinaryConnection().api.delete_resources_by_prefix(`uploads/${id}/applications/`)
    await cloudinaryConnection().api.delete_folder(`uploads/${id}`)
    await Job.findByIdAndDelete(id)
    res.status(200).json({message: "Job deleted"})
}
/**
 * 
 * returns a list of jobs with their respictive companies 
 */
export const getJobsWithCompany = async (req, res, next) =>
{
    const jobs = await Job.find().populate('company')

    res.status(200).json({message: "List of jobs", jobs})
}
/**
 * 
 * recieves company name in request query
 * checks for validity of company name in case of invalidity returns an error
 * otherwise returns a list of that company's jobs
 */
export const getCompanyJobs = async (req, res, next) =>
{
    const {companyName} = req.query

    const company = await Company.findOne({name: companyName})
    if (!company)
        return next(new Error("Invalid company name", {cause: 404}))
    
    const jobs = await Job.find({company: company._id})

    res.status(200).json({message: "List of jobs", jobs})
}
/**
 * 
 * recieves filters to search with in request query and body
 * returns an error in case no filter is sent
 * otherwise returns a list of jobs matching search criteria
 */
export const filterJobs = async (req, res, next) =>
{
    const {workTime, location, seniorityLevel, title} = req.query
    const {techSkills} = req.body

    if (!(workTime || location || seniorityLevel || title || techSkills || techSkills?.size))
        return next(new Error("Please select at least one filter", {cause: 400}))
        
    const query = {}
    if (workTime) 
        query.workTime = workTime;
    if (location) 
        query.location = location;
    if (seniorityLevel) 
        query.seniorityLevel = seniorityLevel;
    if (title) 
    {
        const regex = new RegExp(`^${title}`, 'i')
        query.title = regex;
    }
    if (techSkills) 
        query.techSkills = { $all: techSkills };

    const jobs = await Job.find(query)

    res.status(200).json({message: "Filtered list of jobs", jobs})
}
/**
 * 
 * recieves job id to apply to in request params
 * in case no resume is uploaded or invalidity of id returns an error
 * otherwise uploads resume to the host and creates a new application instance and returns it
 */
export const applyToJob = async (req, res, next) =>
{
    const {user} = req
    const {jobId} = req.params
    const {techSkills, softSkills} = user

    if (!req.file)
        return next(new Error("Please upload your resume", {cause: 400}))
    const job = await Job.findById(jobId)

    if (!job)
        return next(new Error("Invalid job id", {cause: 404}))

    const { secure_url, public_id } = await Cloudinary.upload(`uploads/${jobId}/applications/`, req.file)
    
    req.userResume = { secure_url, public_id } // incase of database error, the error handling middleware will catch the error and delete the files
    
    const application = await Application.create({jobId, userId: user._id, userResume:req.userResume,
        techSkills, softSkills})

    res.status(200).json({message: "Application sent", application})
}

