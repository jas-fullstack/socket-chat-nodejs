import Mongoose from "mongoose";

const Schema = Mongoose.Schema;

const messageSchema = new Schema(
  {
    roomId: { type: Mongoose.Schema.Types.ObjectId, ref: "rooms" },
    from: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { 
      type: String,
      default: 'text',
      enum:['text','image'] 
    },
    message: { type: String },
    url: { type: String  },
    members: [
      {
        userId: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
        deliveredAt: { type: Date },
        delivered: { type: Boolean, default: false},
        readAt: { type: Date },
        read: { type: Boolean, default: false},
        isDeleted: { type:Boolean,default:false},
        isFavourite:{type:Boolean}
      }
    ]
  },
  { timestamps: true }
);

export default messageSchema;
