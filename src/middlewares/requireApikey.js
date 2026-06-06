import "dotenv/config"


const requireApikey = (req, res, next) => {

    const apikey = req.headers['x-api-key']

    if(apikey && apikey === process.env.INTERNAL_API_KEY) {
        next()
    }    else {
        res.status(404).send(`Cannot GET ${req.originalUrl}`)
    }
}

export default requireApikey