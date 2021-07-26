  /*
 * @file: room.js
 * @description: It Contain function layer for room controller.
 * @author: Jaswinder Kumar
 */

import { successAction, failAction } from "../utilities/response";
import {
  roomMembers,roomChat,
  roomChatList,saveRoom
} from "../services/room";
import UserModel from "../collections/user";
import Message from "../utilities/messages";

export const getRoomList = async (req, res, next) => {
  try {
    const data = await roomMembers({userId:req.user.userId});
    res.json(successAction(data, Message.success));
  } catch (error) {
    res.json(failAction(error.message));
  }
};

/* getRoomChat with load more functionality using user id */
export const getRoomChat = async (req, res, next) => {
  try {
    console.log("get Room chat list",req.user.userId)
    var page        = req.query.page || 1;
		var limit       = JSON.parse((req.query.count ? req.query.count : '30'));
    var skip      = (page - 1) * limit;
    const data = await roomChatList({roomId:req.params.roomId,userId:req.user.userId},skip,limit);
    res.json(successAction(data, Message.success));
  } catch (error) {
    res.json(failAction(error.message));
  }
};
/* Get Room Chat by user id */
export const getChat = async (req, res, next) => {
  try {
    const data = await roomChat(req.params);
    if (data) {
      res.json(successAction(data, Message.success));
    } else {
      res.json(successAction([]));
    }
  } catch (error) {
    res.json(failAction(error.message));
  }
};

export const createRoom = async (req, res, next) => {
  try {
    let body = req.body;
    let payload = {
        name:body.name,
        type:'Group',
        createdBy:req.user.userId,
        members:[ {
          userId:req.user.userId,
          type:'Admin'
        }
      ]
    }

    for (let index = 0; index < body.members.length; index++) {
      const memberId = body.members[index];    
      let user = await UserModel.findOne({
        _id:memberId
      },{number:1}).lean();
      payload['members'].push({
        userId:user._id
      })
    }
    const data = await saveRoom(payload);
    res.json(successAction(data, Message.success));
  } catch (error) {
    res.json(failAction(error.message));
  }
};
