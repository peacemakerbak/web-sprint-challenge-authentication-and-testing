const Users = require('./auth-model');
const bcrypt = require("bcryptjs");

module.exports = {
validateRegister,
validateRequestBody,
authenticateUser,
validateLogin,
}
async function validateRegister(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username and password are required" });
  }

  // Check if the user already exists
  const existingUser = await Users.findBy({ username });
  if (existingUser) {
    return res.status(400).json({ message: "username taken" });
  }

  // If user doesn't exist, go to the next middleware or route handler
  next();
}

function validateRequestBody(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "username and password required" });
  }
  next();
}

async function validateLogin(req, res, next) {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username and password are required" });
  }

  // Check if the user exists
  const existingUser = await Users.findBy({ username });
  if (!existingUser) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // If user exists, go to the next middleware or route handler
  req.user = existingUser; 
 
  next();
}
async function authenticateUser(req, res, next) {
  const { password } = req.body;
  const { password: hashedPassword } = req.user; // Assuming req.user is set in the validateLogin middleware

  if (bcrypt.compareSync(password, hashedPassword)) {
    next(); // Password is correct, proceed to the next middleware or route handler
  } else {
    res.status(401).json({ message: "Invalid credentials" }); // Password is incorrect
  }
}