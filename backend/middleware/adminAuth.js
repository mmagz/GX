// Clerk-based admin authorization
// Strategy: Check Clerk user public metadata or org roles. Here we use publicMetadata.role === 'admin'.
const adminAuth = async (req, res, next) => {
    try {
        // Use the new Clerk API - req.auth() as a function
        const auth = req.auth()
        if (!auth || !auth.userId) {
            return res.status(401).json({ success: false, message: 'Not authorized' })
        }
        
        console.log('User ID:', auth?.userId)
        
        // For now, allow your specific user ID for testing
        // In production, you should fetch user metadata from Clerk API
        const allowedTestUserIds = ['user_33dofSrp63OzwzyUhUGYAg4mQfb']
        const userId = auth?.userId
        
       if (allowedTestUserIds.includes(userId)) {
            console.log('Admin access granted for user:', userId)
           return next()
        }
        
        // If not in allowed list, check for role in claims (if available)
        const role = auth?.claims?.metadata?.public?.role || 
                    auth?.claims?.role || 
                    auth?.publicMetadata?.role
        
        if (role === 'admin') {
            console.log('Admin access granted via role:', role)
            return next()
        }
        
        return res.status(403).json({ 
            success: false, 
            message: 'Forbidden - Admin role required',
            debug: {
                role,
                userId: auth?.userId,
                allowedUsers: allowedTestUserIds
            }
        })
    } catch (error) {
        console.log('Admin auth error:', error)
        return res.status(401).json({ success: false, message: 'Not authorized' })
    }
}

export default adminAuth
