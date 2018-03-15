'use strict';
const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));
AWS.config.update({ region: process.env.REGION });
var dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = (event, context, callback) => {
    const done = (error, data) => callback(null, {
        statusCode: error ? error.code : 200,
        headers: {
            'x-custom-header': 'custom header value',
            "Access-Control-Allow-Origin": "*" // Required for CORS support to work
        },
        body: error ? error.message : JSON.stringify(data)
    });

    // HTTP Method (e.g., POST, GET, HEAD)
    let httpMethod = event.httpMethod || '';
    if (httpMethod !== 'GET') return done({ code: 400, message: "invalid method" });

    // Dynamo DB Parameters
    var params = {
        TableName: process.env.TABLE,
    };

    dynamoDb.scan(params).promise()
        .then(data => done(null, data))
        .catch(err => {
            return done({ code: 500, message: `unable to scan table. error: ${JSON.stringify(err, null, 2)}` });
        });
};
