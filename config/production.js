"use strict"
var config = {
  "app": {
    "name": "socket",
    "host": "http://localhost",
    "port": process.env.PORT || 3000,
    "socket": 3002,
    "jwtAlgo": "HS512",
    "jwtKey": "socket"
  },
  "db": {
    "name": process.env.DB_NAME ||  "socket_app",
    "host": process.env.DB_HOST || "localhost",
    "auth": process.env.DB_AUTH ? JSON.parse(process.env.DB_AUTH): false,
    "username": process.env.DB_USERNAME || "",
    "password": process.env.DB__PASSWORD || "",
    "port": process.env.DB_PORT || 27017,
    "mongoose": {
      "useMongoClient": true,
      "autoIndex": true,
      "poolSize": 10,
      "bufferMaxEntries": 0
    }
  }
}

exports = module.exports = config;