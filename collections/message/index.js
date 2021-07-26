/* -----------------------------------------------------------------------
   * @ description : This file defines the message schema for mongodb.
----------------------------------------------------------------------- */

import Mongoose from "mongoose";
import DbSchema from "./db-schema";

class MessageClass {
  static saveMessage(payload) {
    return this(payload).save();
  }
  static findOneByCondition(condition) {
    return this.findOne(condition);
  }
  static findByCondition(condition) {
    return this.find(condition);
  }
  static update(payload) {
    const updateData = {
      $set: {
        ...payload
      }
    };
    return this.findByIdAndUpdate(payload.id, updateData, { new: true });
  }
}

DbSchema.loadClass(MessageClass);

export default Mongoose.model("messages", DbSchema);
