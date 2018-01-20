let jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(' ')[1];
        let decode = jwt.verify(token, "secret", null);
        req.userData = decode;
        next();
    } catch (error) {
        return res.status(409).json({message: "Auth failed"})
    }
}