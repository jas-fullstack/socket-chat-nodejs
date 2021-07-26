/*
 * @file: get-list.js
 * @description: It Contain get room list router/api.
 * @author: Jaswinder Kumar
 */
import express from "express";
import { getRoomChat } from "../../../controllers/room";
import { checkToken } from "../../../utilities/universal";

const app = express();

/**
 * @swagger
 * /api/v1/room-chat-list/<roomId>?page=1&count=30:
 *  get:
 *   tags: ["Room"]
 *   summary: room chat  listing api
 *   description: api used to get room chat list
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

app.get("/room-chat-list/:roomId",checkToken, getRoomChat);

export default app;
