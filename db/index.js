/*
 * @file: index.js
 * @description: It Contain db setup function.
 * @author: Jaswinder Kumar
 */

import mongoose from 'mongoose';
import config from 'config';
const { auth, name, host, username, password, port } = config.get('db');



export const connection = () => {
    const databaseUrl = auth ? `mongodb://${username}:${password}@${host}:${port}/${name}` : `mongodb://${host}:${port}/${name}`;
    // Mongose setup with server
    mongoose.connect(databaseUrl, {
        'useCreateIndex': true,
        'useNewUrlParser': true,
        'useUnifiedTopology': true,
        'useFindAndModify': false
    });
    mongoose.connection.on('connected', function () {
        // console.log('Mongoose connected! ');
    });
}

