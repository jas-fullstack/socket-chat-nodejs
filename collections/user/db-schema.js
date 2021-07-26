/*
 * @file: db-schema.js
 * @description: It Contain db schema for user collection.
 * @author: Jaswinder Kumar
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: ""
    },
    countryCode: {
      type: String,
      required:true
    },
    phone: {
      type: String,
      required:true
    },
    number: {
      type: String,
      required: true
    },
    expireTime: {
      type: Date
    },
    otp: {
      type:String
    },
    email: {
      type:String
    },
    loginToken: [
      {
        token: {
          type: String,
          default: ""
        },
        deviceToken: {
          type: String,
          default: null
        },
        createdAt: {
          type: Date,
          default: new Date()
        }
      }
    ],
    status: {
      type: Number,
      default: 1 // 0 account deleted, 1 active, 2 block
    },
    lastLogin: {
      type: Date,
      default: null
    },
    deviceToken: {
      type:String
    },
    deviceType: {
      type:String
    },
    isDeleted :{
      type: Boolean,
      default: false
    },
    role: {
      type: Number,
      default:3,
      enum: [1,2,3]
    }
  },
  { timestamps: true }
);

export default userSchema;
