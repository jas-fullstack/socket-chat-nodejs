/*
 * @file: user.js
 * @description: It Contain function layer for user service.
 * @author: Jaswinder Kumar
 */

import User from "../collections/user";
import Message from "../utilities/messages";
import { encryptpassword, generateToken } from "../utilities/universal";

export const getLoginOTP = async (payload) => {
  var userData = await User.checkUser(payload);
  if (!userData) {
    userData = await User.saveUser({
      ...payload,
    });
  }
  userData['otp']  = '1111';
  let date                 = new Date();
  date.setMinutes(date.getMinutes() + 15)
  userData['expireTime']   = date;

  let saveData            =  await User.saveUser(userData);
  return {success:true}
}
/********** Save users **********/
export const save = async payload => {
  if (await User.checkEmail(payload.email))
    throw new Error(Message.emailAlreadyExists);

  payload.password = encryptpassword(payload.password);

  const userData = await User.saveUser({
    ...payload,
    role:3
  });
  return userData;
};

/********** Login users **********/
export const onLogin = async payload => {
  const userData = await User.findOneByCondition({
    phone: payload.phone,
    countryCode: payload.countryCode,
    otp: payload.otp,
    expireTime: {$gte : new Date()}
  });
  if (!userData) throw new Error(Message.otpExpired);
  if (userData.status === 0) throw new Error(Message.accountDeleted);
  if (userData.status === 2) throw new Error(Message.userBlocked);

  let loginToken = generateToken({
    when: new Date(),
    lastLogin: userData.lastLogin,
    userId: userData._id
  });
  const data = await User.onLoginDone(userData._id, loginToken, payload);
  return {
    _id: data._id,
    name:data.name,
    email:data.email,
    number:data.number,
    token: data.loginToken[data.loginToken.length - 1].token
  };
};
/********** Logout users **********/
export const logoutUser = async payload => {
  return await User.logout(payload.userId, payload.token);
};

/********* get users *********/
export const getUsers = async (filter,options,sort) => {
  let data = await User.findByCondition(filter,options).sort(sort);
  return data
};
