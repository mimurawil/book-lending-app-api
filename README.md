# Book Lending App
This repo is part of the tiny project/demo/portfolio for a **Super Simple Book Lending App**.

It is responsible for managing simple tasks like:
* List all the books available in the database
* Borrow a book
* Reserve a book (in case it's not available at the moment)
* Return a book (if the user has borrowed it)

This was made using Serverless framework with AWS Lambda and DynamoDB (sls creates API Gateways as well).

For the functions borrow, reserve, and return, a sub-function is automatically called to verify authorization, which is a JWT passed in the header.

## How to install
Assuming you have an [AWS account](https://aws.amazon.com/) and have installed [Serverless](https://serverless.com/), the following steps will explain how to have this project on your machine and install it in the cloud.
1. Clone this repo
2. Open the `serverless.yml` file and create a **JWT_SECRET** (you can create one at https://www.grc.com/passwords.htm)
  2.1. **ATTENTION: the JWT_SECRET must be the same as in the repo book-lending-app-auth (https://github.com/mimurawil/book-lending-app-auth)**
3. Still in the `serverless.yml` file, change the **profile** to yours, but if you don't have one you can probably delete this line to get the default settings
4. Run `serverless deploy` and wait to finish
5. Open the file `handlers/authorize.js` and change the **Resource** value to the ARN of this API. This is just for adding a little more security, the way it is should work.
  5.1. The ARN should look something like this: *arn:aws:execute-api:{REGION}:{ID1}:{ID2}:{SOMETHING}*

## How to uninstall
1. Run `serverless remove`, this will delete all stack created in AWS by Serverless.
