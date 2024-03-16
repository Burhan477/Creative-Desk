const authMiddleware = (req: any, res: any, next: any) => {
  // Assuming user information is stored in req.user

  // Allow GET APIs without authentication

  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  if (req.user.role !== 'admin' && req.originalUrl === '/api/profile') {
    return next()
  }
  if (req.method === 'GET') {
    return next()
  }
  // Check if user is admin to access all POST APIs
  if (
    req.user.role === 'admin' &&
    (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE')
  ) {
    return next()
  }

  // Other roles can only access GET APIs
  return res.status(403).json({ message: 'Authorization required' })
}

export default authMiddleware
