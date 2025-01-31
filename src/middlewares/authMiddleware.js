const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    let token = req.cookies.token;

    if (!token) {
        token = req.headers['x-access-token']; // Get the token from headers if not in cookies
    }

    if (!token) {
        return res.status(401).send({ error: 'Not authenticated' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the user to the request object

        // Check if the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).send({ error: 'Forbidden: Admins only' });
        }

        next();
    } catch (error) {
        res.status(401).send({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;