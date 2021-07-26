/*
 * @file: get-list.js
 * @description: It Contain get room list router/api.
 * @author: Jaswinder Kumar
 */
import express from "express";
import { getRoomList } from "../../../controllers/room";
import { checkToken } from "../../../utilities/universal";

const app = express();

/**
 * @swagger
 * /api/v1/room-list:
 *  get:
 *   tags: ["Room"]
 *   summary: API use to fetch Chat Rooms
 *   description: API use to fetch Chat Rooms
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

app.get("/room-list",checkToken, getRoomList);

export default app;
