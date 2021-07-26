/*
 * @file: index.js
 * @description: It Contain function layer for user collection.
 * @author: Jaswinder Kumar
 */

import mongoose from "mongoose";
import dbSchema from "./db-schema";

class UserClass {
  static saveUser(payload) {
    return this(payload).save();
  }
  static checkUser(payload) {
    return this.findOne(payload);
  }
  static findOneByCondition(condition) {
    return this.findOne(condition);
  }
  static findByCondition(condition,options) {
    return this.find(condition,options);
  }
  static checkUsername(username) {
    return this.findOne({ username });
  }
  static checkToken(token) {
    return this.findOne({ "loginToken.token": token });
  }
  static onLoginDone(userId, loginToken, payload = {}) {
    let updateData = {
      $push: {
        loginToken: {
          token: loginToken,
          deviceToken: payload["deviceToken"],
          deviceType: payload["deviceType"]
        }
      },
      $set: {
        lastLogin: new Date(),
        deviceToken:payload["deviceToken"],
        deviceType: payload["deviceType"]
      }
    };

    return this.findByIdAndUpdate(userId, updateData, { new: true });
  }
  static updateUser(payload) {
    let updateData = {
      $set: {
        ...payload
      }
    };
    return this.findByIdAndUpdate(payload._id, updateData, { new: true });
  }
  static logout(userId, token) {
    let updateData = {
      $pull: { loginToken: { token } }
    };
    return this.findByIdAndUpdate(userId, updateData);
  }
}

dbSchema.loadClass(UserClass);

export default mongoose.model("User", dbSchema);
