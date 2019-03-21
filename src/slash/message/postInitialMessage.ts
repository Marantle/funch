import Axios from "axios";
import { ChatPostMessageArguments } from "@slack/client";
import { SlackApiResponse } from "src/slash/message/ApiResonse";
export default async (channelId: string): Promise<string> => {

  const msgBody: ChatPostMessageArguments = {
    text: 'You wanna eat!?',
    channel: channelId,
  }

  const postMessageRes = await Axios.post<SlackApiResponse>(
    'https://slack.com/api/chat.postMessage',
    msgBody
  )
  
  if (postMessageRes.status === 200 && postMessageRes.data.ts) {
    const { ts } = postMessageRes.data
    return ts
  } else {
    throw `postMessage returned ${postMessageRes.status}`
  }
}