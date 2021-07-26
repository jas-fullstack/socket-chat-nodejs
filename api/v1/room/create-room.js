/*
 * @file: get-list.js
 * @description: It Contain get room list router/api.
 * @author: Jaswinder Kumar
 */
import express from "express";
import { createRoom } from "../../../controllers/room";
import { checkToken } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const validator = createValidator({ passError: true });

const app = express();


/**
 * @swagger
 * /api/v1/create-room:
 *  post:
 *   tags: ["Room"]
 *   summary: API use to create New Room/Group 
 *   description: API use to create New Room/Group
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: body
 *        name: user
 *        description: create Room API.
 *        schema:
 *         type: object
 *         required:
 *          - user add
 *         properties:
 *           name:
 *             type: string
 *           members:
 *             type: object
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const schema = Joi.object({
    name: Joi.string()
        .required()
        .label("name"),
    members: Joi.array()
        .required()
        .label("members")
});
app.post("/create-room",
    validator.body(schema, {
        joi: { convert: true, allowUnknown: false }
    }),
    checkToken, 
    createRoom
);

export default app;
