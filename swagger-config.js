/*
 * @file: swagger-config.js
 * @description: It Contain swagger configrations.
 * @author: Jaswinder Kumar
 */
import swaggerJsDocs from "swagger-jsdoc";

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Socket Chat project API's",
      version: "1.0",
      description: "All api end points",
      contact: {
        name: "Jaswinder Kumar"
      },
      servers: ["http://localhost:3000"]
    },
    produces: ["application/json"],
    host: `localhost:3000`
  },
  apis: ["./api/v1/**/*.js"],
  layout: "AugmentingLayout"
};
export default swaggerJsDocs(swaggerOptions);
