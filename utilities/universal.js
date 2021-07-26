/*
 * @file: universal.js
 * @description: It Contain function layer for all commom function.
 * @author: Jaswinder Kumar
 */
import md5 from "md5";
import jwt from "jsonwebtoken";
import config from "config";
const { jwtAlgo, jwtKey } = config.get("app");
import User from "../collections/user";
import { failAction } from "./response";
import Message from "./messages";
// password encryption.
export const encryptpassword = password => {
  return md5(password);
};
/*********** Generate JWT token *************/
export const generateToken = data =>
  jwt.sign(data, jwtKey, { algorithm: jwtAlgo, expiresIn: "90d" });
/*********** Decode JWT token *************/
export const decodeToken = token => jwt.verify(token, jwtKey);
/*********** Verify token *************/
export const checkToken = async (req, res, next) => {
  const token = req.headers["authorization"];
  let decoded = {};
  try {
    decoded = jwt.verify(token, jwtKey);
  } catch (err) {
    return res.status(401).json(failAction(Message.tokenExpired, 401));
  }
  const user = await User.checkToken(token);
  if (user) {
    req.user = { ...decoded, token };
    next();
  } else {
    res.status(401).json(failAction(Message.unauthorizedUser, 401));
  }
};
