/* -----------------------------------------------------------------------
   * @ description : This file defines the room schema for mongodb.
----------------------------------------------------------------------- */

import Mongoose from "mongoose";
import DbSchema from "./db-schema";

class RoomClass {
  static add(payload) {
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
    return this.findByIdAndUpdate(payload._id, updateData, { new: true });
  }
}

DbSchema.loadClass(RoomClass);

export default Mongoose.model("rooms", DbSchema);
