// Middleware for api key authentication!!
const apiKey =  (req,res,next) => {
    const key = req.query.apiKey;
    console.log(key);
    if (key !== 'keyforvyshnav') {
        return res.status(401).json({error : 'Unauthorized - Invalid API token.'})
    }
    next()
}; export default apiKey