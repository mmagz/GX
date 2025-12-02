// Clerk-based auth: require a valid Clerk session and expose userId
const authUser = async (req, res, next) => {
    try {
        const { auth } = req
        if (!auth || !auth.userId) {
            return res.status(401).json({ success: false, message: 'Not authorized' })
        }
        req.body.userId = auth.userId
        return next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ success: false, message: 'Not authorized' })
    }
}

export default authUser