/*
 * @file: login.js
 * @description: It Contain login router/api.
 * @author: Jaswinder Kumar
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { login } from "../../../controllers/user";
import { DEVICE, ROLE } from "../../../utilities/constants";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/login:
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
 *           otp:
 *             type: string
 *             required:
 *           deviceToken:
 *             type: string
 *           deviceType:
 *             type: string
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
    .label("Phone"),
  otp: Joi.string()
    .trim()
    .required()
    .label("otp"),
  deviceToken: Joi.any()
    .optional()
    .allow("")
    .label("Device Token"),
  deviceType: Joi.string()
    .optional()
    .allow("")
    .valid("", DEVICE.IOS, DEVICE.ANDROID)
    .label("Device Type")
});

app.post(
  "/login",
  validator.body(userSchema, {
    joi: { convert: true, allowUnknown: false }
  }),
  login
);

export default app;
