/*
 * @file: login.js
 * @description: It Contain login router/api.
 * @author: Jaswinder Kumar
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { getOTP } from "../../../controllers/user";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/get-otp:
 *  post:
 *   tags: ["Auth"]
 *   summary: user login api
 *   description: api used to login users <br/>
 *   parameters:
 *      - in: body
 *        name: user
 *        description: The user to login.
 *        schema:
 *         type: object
 *         required:
 *          - user login
 *         properties:
 *           countryCode:
 *             type: string
 *             required:
 *           phone:
 *             type: string
 *             required:
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const userSchema = Joi.object({
  countryCode: Joi.string()
    .required()
    .label("countryCode"),
  phone: Joi.string()
    .required()
    .label("Phone")
});

app.post(
  "/get-otp",
  validator.body(userSchema, {
    joi: { convert: true, allowUnknown: false }
  }),
  getOTP
);

export default app;
