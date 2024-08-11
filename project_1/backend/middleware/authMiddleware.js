const jwt = require('jsonwebtoken');
const { secretOrKey } = require('../config');

module.exports = function(req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Token is missing or improperly formatted' });
  }

  try {
    const decoded = jwt.verify(token, secretOrKey);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
};
