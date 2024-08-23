const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token){
    return res.status(401).json({message: 'token required'})
  }
  const secret = process.env.JWT_SECRET || 'secretKey123'
  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      // the token is invalid or has expired
      console.log('jwterror', err)
      return res.status(401).json({ message: "token invalid" });
    }

    // the token is valid, save the decoded token to the request
    req.decodedToken = decodedToken;
    next();
  });
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};