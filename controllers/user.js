  /*
 * @file: user.js
 * @description: It Contain function layer for user controller.
 * @author: Jaswinder Kumar
 */

import { successAction, failAction } from "../utilities/response";
import {
  getLoginOTP, onLogin, logoutUser } from "../services/user";
import Message from "../utilities/messages";

/**************** getLoginOTP ***********/
export const getOTP = async (req, res, next) => {
  const payload = req.body;
  try { 
      payload['number'] = payload['countryCode'] + payload['phone'];

      const data = await getLoginOTP(payload);
      res.json(successAction(data, Message.otpSent));
  } catch(error) {
      res.json(failAction(error.message));
  }
};
/**************** appLogin ***********/
export const login = async (req, res, next) => {
  const payload = req.body;
  try {
    payload['number'] = payload['countryCode'] + payload['phone'];
    const data = await onLogin(payload);
    res.status(200).json(successAction(data, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**************** Logout user ***********/
export const logout = async (req, res, next) => {
  const payload = req.user;
  try {
    await logoutUser(payload);
    res.status(200).json(successAction(null, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};
