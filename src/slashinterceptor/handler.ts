import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult,
  Callback
} from "aws-lambda";
import { Lambda } from "aws-sdk";

import "source-map-support/register";
export const slashinterceptor: APIGatewayProxyHandler = (
  event: APIGatewayEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
) => {
  let lambda = new Lambda();
  let params = {
    InvocationType: "Event", // Ensures asynchronous execution
    FunctionName: `funch-${process.env.STAGE}-slash`,
    Payload: JSON.stringify(event)
  };
  console.log(`received request, forwarding to ${params.FunctionName}`);
  lambda
    .invoke(params)
    .promise() // Returns 200 immediately after invoking the second lambda, not waiting for the result
    .then(() => {
      const res = {
        statusCode: 200,
        body: JSON.stringify({
          text: "sain",
          response_type: "ephemeral",
          // event: _event,
          // context: _context,
        })
      };
      callback(null, res);
    });
};
