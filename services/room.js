/*
 * @file: room.js
 * @description: It Contain function layer for room service.
 * @author: Jaswinder Kumar
 */

import Model from "../collections/room";
import MessageSchema from "../collections/message";
import mongoose from "mongoose";

/********* Get Room Members list **********/
export const roomMembers = async (query) => {
  // ,isDeleted:false
  let roomDataArr = await Model.find({
      members: { $elemMatch: { userId: mongoose.Types.ObjectId(query.userId),isDeleted:false } },
  }).select({
      "members.userId": 1,
      "members.type":1,
      "members.mute":1,
      type:1,
      name:1,
      profileImage:1
  }).populate("members.userId", "number name profileImage profileStatus").sort({lastMessageDate:-1}).lean();

  for (let index = 0; index < roomDataArr.length; index++) {
    roomDataArr[index].members.forEach((elm,i) => {
      let s = JSON.parse(JSON.stringify({...elm,...elm.userId}))
      s['userId'] = s.userId._id
      delete s['_id'];
      roomDataArr[index]['members'][i] = s
    });
  }
  var roomObject = Promise.all(roomsUnreadMessagesCount(roomDataArr, query));  
  return roomObject;
};


/********* Get User Chat **********/
export const roomChat = async (query) => {
  try {
    let roomChatDataArr = await MessageSchema.find({
      roomId: mongoose.Types.ObjectId(query.roomId),
      members: { $elemMatch: {"userId": mongoose.Types.ObjectId(query.userId),isDeleted:false}}
    }).populate("from", "number name profileImage");

    return roomChatDataArr;
  } catch(error) {
    console.log("errrr",error)
    throw error;
  }
  
};

/********* saveRoom **********/
export const saveRoom = async (payload) => {
  try {
    return await Model.add(payload)
  } catch(error) {
    throw error;
  }
};

const roomsUnreadMessagesCount = (roomData, query) => {
  return roomData.map(async (room) => {

    const lastMessage = await MessageSchema.findOne({
      roomId:mongoose.Types.ObjectId(room._id),
      members: { $elemMatch: {"userId": mongoose.Types.ObjectId(query.userId),isDeleted:false}}
    },{message:1,createdAt:1,type:1,from:1}).sort({createdAt:-1})
   return {
    _id: room._id,
    type:room.type,
    name:room.name,
    profileImage:room.profileImage,
    lastMessageFrom:lastMessage ? lastMessage.from:'',
    lastMessageType:lastMessage ? lastMessage.type:'',
    lastMessage:lastMessage ? lastMessage.message:'',
    lastMessageDate:lastMessage ? lastMessage.createdAt:null,
    members: room.members.filter(
      (member) => member.userId.toString() !== query.userId.toString()
    ),
    user: room.members.find(
      (member) => member.userId.toString() === query.userId.toString()
    ),
    unreadCount: await MessageSchema.findByCondition({
      roomId: mongoose.Types.ObjectId(room._id),
      members: { $elemMatch: { userId: mongoose.Types.ObjectId(query.userId),read:false,isDeleted:false } }
    }).countDocuments(),
  }
});
};
