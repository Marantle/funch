import Axios from "axios";
import { SlackApiResponse } from "src/slash/message/ApiResonse";
import { APIGatewayProxyResult } from "aws-lambda";

export default async (responseUrl: string, msg: string) => {
  const payload: APIGatewayProxyResult = {
    statusCode: 418,
    body: JSON.stringify({
      text: msg,
      response_type: 'ephemereal',
    }),
  }
  
  console.log('axios error', msg)
  const postMessageRes = await Axios.post<SlackApiResponse>(
    responseUrl,
    payload,
  )
  if (postMessageRes.status === 200 && postMessageRes.data.ts) {
    console.log(`error with status: ${postMessageRes.status}, ts is ${postMessageRes.data.ts}`)
    const { ts } = postMessageRes.data
    console.log(`post message had ts ${ts}`)
  } else {
    throw new Error(`postMessage error: ${postMessageRes.statusText}, with status ${postMessageRes.status}, with data ${JSON.stringify(postMessageRes.data)}`)
  }
}