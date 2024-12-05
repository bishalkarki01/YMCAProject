/**
 * Author : Bishal Karki
 * Discription: Middleware to authenticate token for secure login 
 * Created : 2 October 2024
 * Last Modifies: 3 December 2024
 *
 * 
 */

const jwt = require("jsonwebtoken");

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  const bearerToken = token.split(" ")[1];
  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token." });

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
