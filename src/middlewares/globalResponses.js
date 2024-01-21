
export const globalResponse = (err, req, res, next) =>
{
    if (err)
    {
        console.log(err.stack)
        return res.status(err['cause'] || 500).json(
        {
            message: 'catch error',
            errorMessage: err.message       
        })
    }
}