const db = require("../../data/dbConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  add,
  findBy,
  checkPassword,
  generateToken,
};

async function add(user) {
  await db("users").insert(user);
  return findBy({ username: user.username });
}

function findBy(filter) {
  return db("users").select("id", "username", "password").where(filter).first();
}
function checkPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
   
  };
  const secret = process.env.JWT_SECRET || 'secretKey123';


  const options = {
    expiresIn: "1d", 
  };

  return jwt.sign(payload, secret, options);
}