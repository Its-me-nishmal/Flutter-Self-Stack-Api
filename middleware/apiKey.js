// Middleware for api key authentication!!
const apiKey =  (req,res,next) => {
    const key = req.query.apiKey;
    if (key !== 'flutterbyafaf') {
        return res.status(401).json({error : 'Unauthorized - Invalid API token.'})
    }
    next()
}; export default apiKey