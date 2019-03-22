import Axios from "axios";
import { ChatPostMessageArguments } from "@slack/client";
import { SlackApiResponse } from "src/slash/message/ApiResonse";
export default async (channelId: string): Promise<string> => {
  console.log('')
  const msgBody: ChatPostMessageArguments = {
    text: 'You wanna eat!?',
    channel: channelId,
  }
  console.log('axios post', msgBody)
  const postMessageRes = await Axios.post<SlackApiResponse>(
    'https://slack.com/api/chat.postMessage',
    msgBody
  )
  console.log('axios posted')
  if (postMessageRes.status === 200 && postMessageRes.data.ts) {
    console.log(`posted with status: ${postMessageRes.status}, ts is ${postMessageRes.data.ts}`)
    const { ts } = postMessageRes.data
    return ts
  } else {
    throw new Error(`postMessage returned ${postMessageRes.statusText} with status ${postMessageRes.status} with data ${JSON.stringify(postMessageRes.data)}`)
  }
}