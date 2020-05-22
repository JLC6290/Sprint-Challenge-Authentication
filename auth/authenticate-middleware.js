/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets');

  // Authenticate User
module.exports = function verifyUser(req, res, next) {
  const token = req.headers.authorization;
  if(token){
    jwt.verify(token, secrets.jwtSecret, (error, decodedToken) => {
      if(error){
        res.status(401).json({ message: 'invalid token' });
      }else{
        req.username = decodedToken.username;
        next();
      }
    })
  }else{
    res.status(401).json({ you: 'shall not pass!' });
  }
}  

