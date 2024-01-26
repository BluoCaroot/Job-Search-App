import jwt from 'jsonwebtoken'
import User from '../../DB/models/user.model.js'
import { systemRoles } from '../utils/systemRoles.js'

export const auth = (accessRoles = [systemRoles.HR, systemRoles.USER])=>
{
    return (async (req, res, next) =>
    {
        try
        {
            const {accesstoken} = req.headers

            if (!accesstoken)
                return next(new Error('please login first', {cause: 400}))
            
            if (!accesstoken.startsWith(process.env.TOKEN_PREFIX))
                return next(new Error('invalid token prefix', {cause: 400}))
            const token = accesstoken.split(process.env.TOKEN_PREFIX)[1]

            const decodedData = jwt.verify(token, process.env.LOGIN_SIGNATURE)
            if (!decodedData || !decodedData.id)
                return next(new Error('invalid token payload', {cause: 400}))
            
            const user = await User.findById(decodedData.id)
            if (!user)
                return next(new Error('user not found', {cause: 404}))
            if (!accessRoles.includes(user.role))
                return next(new Error('unauthorized', { cause: 401 }))
            req.user = user
            next()
        }
        catch (err)
        {
            return next (new Error(`caught error in auth middlware\n ${err}`), {cause: 500})
        }
    })
}