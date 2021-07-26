/* -----------------------------------------------------------------------
   * @ description : Main module containing all the Event management functonality
----------------------------------------------------------------------- */

import User from "../collections/user";
import Room from "../collections/room";
import Message from "../collections/message";
import Mongoose from "mongoose";

export default {
  /************ Authenticate user on make socket connection ********/
  authenticateUser: async (userId, callback) => {
    const user = await User.checkToken(token);
    if(user) callback({ userId, user,activeUsers:user.activeUsers || [] });
    else callback(null);
  },
  /************ Save messages **********/
  sendMessage: async (data, callback) => {

    const userExist = await User.findOne({_id:data.to,status:1},{number:1,name:1});
    if(userExist) {
    let room = await Room.findOneByCondition({
          type:'Single',
          members: {
            $all:[
              { $elemMatch: {"userId": Mongoose.Types.ObjectId(data.from)}},
              { $elemMatch: {"userId": Mongoose.Types.ObjectId(data.to)}}
            ]
      }});
      if (!room) {
        room = await Room.add({
          createdBy: data.from,
          members: [
            {
              userId: data.from
            },
            {
              userId: data.to
            }
          ]
        });
      }

      data['roomId'] = room._id;
      data['from'] = data.from;
      data['members'] = [{
        userId:data.to
      },{
        userId:data.from,
        read:true,
        delivered:true,
        deliveredAt:new Date(),
        readAt:new Date()
      }];
      let message = await Message.saveMessage({ ...data });
      if (message) {
        for (let index = 0; index < room.members.length; index++) {
          if(room.members[index].isDeleted) {
            await Room.findOneAndUpdate({
              _id:room._id,
              'members.userId': room.members[index].userId
            },{
              '$set': {'members.$.isDeleted': false}
            })
          }
        }
      const payload = {
        _id: data.roomId,
        lastMessageDate: new Date()
      };
      await Room.update(payload);
    
      message = await Message.findByCondition({
        _id: Mongoose.Types.ObjectId(message._id)
      }).populate("from", "_id number name profileImage");
      
      callback(message[0]);
      } else { callback(null); }
    } else {
      callback(null);
    }
  },

  /************ Save Groip messages **********/
  sendGroupMessage: async (payload, callback) => {

    let room = await Room.findOneByCondition({
        type:'Group',
        _id:payload.roomId
    },{members:1});
    if(room) {
      payload['members'] = room.members.filter(
        (member) => member.userId.toString() !== payload.from.toString()
      );
      payload['members'].push({
        userId:payload.from,
        read:true,
        delivered:true,
        deliveredAt:new Date(),
        readAt:new Date()
      })
      let message = await Message.saveMessage({ ...payload });
      if (message) {
        room = {
          _id: room._id,
          lastMessage: payload.message,
          lastMessageBy: payload.from,
          lastMessageDate: new Date()
        };
        const roomData = await Room.update(room);
        message = await Message.findByCondition({
          _id: Mongoose.Types.ObjectId(message._id)
        }).populate("from", "_id number name profileImage");
        callback(message[0]);
      } else { callback(null); }
    } else { callback(null) }
    
  },

  /************ Logout socket session on discoonect socket **********/
  disconnect: async (request, callback) => {
    const { userId } = request;
    let user = await User.updateUser({_id:userId,lastActive: new Date(),onlineStatus:'offline'});
    await User.findOneAndUpdate({activeUsers:{$in:[userId]}},{$pull: { activeUsers: userId }});    
    callback({user,activeUsers:user.activeUsers});
  },

};
