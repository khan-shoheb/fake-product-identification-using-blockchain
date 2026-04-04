// Role-based authentication middleware

module.exports = function(requiredRole) {
  return function(req, res, next) {
    // Example: Role can be sent in headers (x-user-role)
    const userRole = req.headers['x-user-role'];
    if (!userRole) {
      return res.status(401).json({ error: 'Role not provided' });
    }
    if (userRole !== requiredRole) {
      return res.status(403).json({ error: 'Access denied: insufficient role' });
    }
    next();
  };
};
