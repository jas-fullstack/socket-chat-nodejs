/*
 * @file: index.js
 * @description: It's combine all routers.
 * @author: Jaswinder Kumar
 */

import user from "./v1/user";
import room from "./v1/room";

/*********** Combine all Routes ********************/
export default [
    ...user,
    ...room,
];
