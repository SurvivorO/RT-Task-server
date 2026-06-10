import jwt from "jsonwebtoken"

const checkAuth = (req, res, next) => {
    const token = req.cookies?.token

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch (error) {
        return res.status(403).json({ message: "Error loggin in user" })
    }
}

export default checkAuth