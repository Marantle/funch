import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult,
  Callback
} from "aws-lambda";

import { v1 } from "uuid";

import { config, DynamoDB } from "aws-sdk";

config.setPromisesDependency(require("bluebird"));

const dynamoDb = new DynamoDB.DocumentClient();

export const submit: APIGatewayProxyHandler = (
  event: APIGatewayEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
) => {
  const requestBody = JSON.parse(event.body);
  const fullname = requestBody.fullname;
  const email = requestBody.email;
  const experience = requestBody.experience;

  if (
    typeof fullname !== "string" ||
    typeof email !== "string" ||
    typeof experience !== "number"
  ) {
    console.error("Validation Failed");

    callback(
      new Error("Couldn't submit candidate because of validation errors.")
    );

    return;
  }

  submitCandidateP(candidateInfo(fullname, email, experience))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted candidate with email ${email}`,
          candidateId: res.id
        })
      });
    })

    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit candidate with email ${email}`
        })
      });
    });
};

const submitCandidateP = candidate => {
  console.log("Submitting candidate");

  const candidateInfo = {
    TableName: process.env.CANDIDATE_TABLE,
    Item: candidate
  };

  return dynamoDb
    .put(candidateInfo)
    .promise()
    .then(_res => candidate);
};

const candidateInfo = (fullname, email, experience) => {
  const timestamp = new Date().getTime();
  return {
    id: v1(),
    fullname: fullname,
    email: email,
    experience: experience,
    submittedAt: timestamp,
    updatedAt: timestamp
  };
};
