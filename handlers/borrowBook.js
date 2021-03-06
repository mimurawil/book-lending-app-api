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

    // Get from authorizer
    let userId = event.requestContext.authorizer.user;

    // event.path.id
    let bookId = event.pathParameters.id;

    // HTTP Method (e.g., POST, GET, HEAD)
    let httpMethod = event.httpMethod || '';
    if (httpMethod !== 'POST') return done({ code: 400, message: "invalid method" });

    // Dynamo DB Parameters
    var params = {
        TableName: process.env.TABLE,
        Key: {
            "itemId": bookId
        }
    };

    dynamoDb.get(params).promise()
        .then(data => {
            if (!data.Item) return done({ code: 404, message: "book not found" });

            if (data.Item.borrowedTo) return done({ code: 400, message: "this book is not available right now" });

            let returnDate = new Date(new Date().getTime() + (7 * 24 * 60 * 60 * 1000));
            let updateParams = {
                TableName: process.env.TABLE,
                Key: {
                    "itemId": bookId
                },
                UpdateExpression: "set borrowedTo = :user, returnDate = :returnDate",
                ExpressionAttributeValues: {
                    ":user": userId,
                    ":returnDate": returnDate.toDateString()
                },
                ReturnValues: "ALL_NEW"
            };
            dynamoDb.update(updateParams).promise()
                .then(data => {
                    return done(null, { message: "borrowed" });
                })
                .catch(err => {
                    return done({ code: 500, message: `unable to update item. error: ${JSON.stringify(err, null, 2)}` });
                });
        })
        .catch(err => {
            return done({ code: 500, message: `unable to read item. error: ${JSON.stringify(err, null, 2)}` });
        });
};
