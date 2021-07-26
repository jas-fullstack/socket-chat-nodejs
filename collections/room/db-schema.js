import Mongoose from "mongoose";

const Schema = Mongoose.Schema;

const roomSchema = new Schema(
  {
    name: { type: String},
    profileImage: { type: String},
    createdBy: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [
      {
        userId: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
        isActive: { type: Boolean }, // 0=> inactive, 1=> active
        type: { type: String }, // member, admin
        joinedAt: { type: Date, default: Date.now },
        isDeleted: { type:Boolean,default:false},
      }
    ],
    type: { 
      type: String, 
      default: 'Single',
      enum:['Single','Group'] 
    }, // 1=> single, 2=> group
    lastMessage: { type: String },
    lastMessageBy: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
    lastMessageDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default roomSchema;
