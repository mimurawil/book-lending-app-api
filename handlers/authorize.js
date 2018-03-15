'use strict';

var jwt = require('jsonwebtoken');

/**
  * Authorizer functions are executed before your actual functions.
  * @method authorize
  * @param {String} event.authorizationToken - JWT
  * @throws Returns 401 if the token is invalid or has expired.
  */
module.exports.handler = (event, context, callback) => {
    const token = event.authorizationToken;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const policy = {
            principalId: decoded.username,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        // Resource: event.methodArn,
                        Resource: '*'
                    },
                ],
            },
            context: {
                user: decoded.username
            }
        };

        callback(null, policy);
    } catch (e) {
        callback("Unauthorized");
    }

};
