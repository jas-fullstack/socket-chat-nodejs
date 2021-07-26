/*
 * @file: logout.js
 * @description: It Contain logout router/api.
 * @author: Jaswinder Kumar
 */
import express from "express";
import { logout } from "../../../controllers/user";
import { checkToken } from "../../../utilities/universal";

const app = express();

/**
 * @swagger
 * /api/v1/logout:
 *  delete:
 *   tags: ["Auth"]
 *   summary: user logout api
 *   description: api used to logout users
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

app.delete("/logout", checkToken, logout);

export default app;
