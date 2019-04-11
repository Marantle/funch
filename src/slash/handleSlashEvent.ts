import { parse } from "querystring";
import Axios from "axios";
import { APIGatewayProxyEvent } from "aws-lambda";
import { postInitialMessage } from "src/slash/message/postInitialMessage";
import reactToInitialMessage from "src/slash/message/reactToInitialMessage";
import { Slash } from "src/slash/slashtype";

import { botAccessToken } from "src/secret/credentials";
import { textBody } from "src/util/util";
import PostEphemerealError from "src/slash/message/PostEphemerealError";

Axios.defaults.headers.common["Authorization"] = `Bearer ${botAccessToken}`;
Axios.defaults.headers.common["Content-type"] =
  "application/json; charset=UTF-8";

type Body = APIGatewayProxyEvent["body"];
type Headers = APIGatewayProxyEvent["headers"];

export default async (body: Body, headers: Headers) => {
  console.log("handling slash event");
  if (headers["Content-Type"] !== "application/x-www-form-urlencoded") {
    return {
      statusCode: 415,
      body: textBody("x-www-form-urlencoded required")
    };
  }
  const reqBody = (parse(body) as unknown) as Slash;

  console.log("body had channelid, posting message", reqBody);
  if ("response_url" in reqBody) {
    const { response_url: responseUrl, channel_id: channelId } = reqBody;
    try {
      const messageTimestamp = await postInitialMessage(channelId, responseUrl);
      console.log(
        `message posted, reacting... timestamp: ${messageTimestamp}, channelId: ${channelId}`
      );
      await reactToInitialMessage(channelId, messageTimestamp);
      console.log("reacted to message");
    } catch (error) {
      console.error(error.message);
      PostEphemerealError(responseUrl, textBody(error.message));
      console.log("posted ephemereal error from handleSlashEvents");
    }
  }
};
