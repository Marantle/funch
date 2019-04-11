import Axios from "axios";
import { SlackApiResponse } from "src/slash/message/ApiResonse";
import PostEphemerealError from "src/slash/message/PostEphemerealError";
import { ChatPostMessageArguments } from "@slack/client";

//we need responseurl to reply to the slash command 
//but we need to use channelId when posting to get the timestamp which responseUrl wont give us
export const postInitialMessage = async (channelId: string, responseURl: string): Promise<string> => {
  const msgBody: ChatPostMessageArguments = {
    text: 'You wanna eat!?',
    channel: channelId,
  }
  console.log('axios post message', msgBody)
  const postMessageRes = await Axios.post<SlackApiResponse>(
    'https://slack.com/api/chat.postMessage',
    msgBody
  )
  console.log('responseded1', postMessageRes.headers)

  if (postMessageRes.status === 200 && postMessageRes.data.ts) {
    console.log(
      `posted with status: ${postMessageRes.status}, ts is ${
        postMessageRes.data.ts
      }`
    );
    const { ts } = postMessageRes.data;
    return ts;
  } else {
    const text = `postMessage returned ${
      postMessageRes.statusText
    } with status ${postMessageRes.status} with data ${JSON.stringify(
      postMessageRes.data
    )}`;

    PostEphemerealError(responseURl, text);
  }
};
