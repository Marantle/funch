import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult,
  Callback
} from "aws-lambda";

import "source-map-support/register";
import handleSlashEvent from 'src/slash/handleSlashEvent'

export const slash: APIGatewayProxyHandler = (
  event: APIGatewayEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
) => {
  console.log('event follows', JSON.stringify(event, null, 2))
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ text: "sain", response_type: "ephemeral" })
  });
  console.log("received request");
  handleSlashEvent(event.body, event.headers);
};
