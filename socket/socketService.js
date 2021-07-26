import socketHandler from "./handler";
import * as TYPE from "./constants";
const socketIO = require("socket.io");
import Message from '../utilities/messages';

export default server => {

  let io = socketIO(server);
  let users = {};
  io.on("connection", socket => {

    /* @description: connect users all Group  with sockets
     * @param token  token here for securit and authentication purpuse 
     */
    try {
    
    socketHandler.authenticateUser(socket.handshake.query.token, res => {
      try {
        if(res) {
          
          socket[socket.id] = res.userId;
          users[res.userId] = socket.id;

          socket.join(res.userId);
          console.log("conected",res.userId,process.pid);
        } else {
          // IF user is not authenticate then will disconnected
          socket.disconnect();
        }
      } catch(e) { console.log("Error Authenticate Socket",e)}
    });
  } catch(err) { }

    /* ********************************************
     * @description: Disconnect Socket
     * @param userId
     */
    socket.on("disconnect", data => {
      try {
        const userId = socket && socket[socket.id] ? socket[socket.id] : "";
        console.log("socket disconnected ",userId)
        if (userId) {
          socketHandler.disconnect({ userId }, res => {
            delete users[userId];
            socket.leave(userId);
          });
        }
      } catch(e) { }
    });

    /* ********************************************
     * @description: send one-one message
     * @param message
     * @param url
     * @param from
     * @param to
     */
    socket.on(TYPE.MESSAGE, (data,callback) => {
      try {
        console.log("on message received,",data)
        socketHandler.sendMessage({ ...data }, res => {
          if(res) {
            callback({statusCode:200,data:res,message:Message.success})
            if (users[res.members[0].userId]) {
              socket.to(users[res.members[0].userId]).emit(TYPE.NEW_MESSAGE, res);
            }
          } else {
            callback({statusCode:400,message:Message.notSent,data:res})
          }
        });
      } catch(e) { }
    });

    /* ********************************************
     * @description: send Group Message
     * @param message
     * @param url
     * @param from
     * @param roomId
     */
    socket.on(TYPE.GROUP_MESSAGE, (data,callback) => {
      try {
        console.log("group message Received",data)
        socketHandler.sendGroupMessage({ ...data }, res => {
          if(res) {
            callback({statusCode:200,data:res,message:Message.success})
            let memberIds = res.members
                    .filter(e => {if(e.userId.toString() != res.from._id.toString()) return e})
                    .map(e=> { return e.userId})
            memberIds.forEach(member=>{
              if(users[member]) socket.to(users[member]).emit(TYPE.NEW_MESSAGE, res);
            })
          } else {
            callback({statusCode:400,message:Message.notSent,data:res})
          }
        });
      } catch(e) { } 
    });

  });


};
