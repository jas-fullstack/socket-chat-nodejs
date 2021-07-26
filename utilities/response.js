/*
 * @file: response.js
 * @description: It Contain function layer for api response status with data.
 * @author: Jaswinder Kumar
 */

export const successAction = (data, message = 'OK') => {
    return ({ statusCode: 200, data, message });
}

export const failAction = (message = 'Fail', statusCode = 400) => {
    return ({ statusCode, data: null, message });
}